from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Badge, AchievementLog, TokenTransaction, TokenBalance, UserBadgeProgress
from rest_framework import serializers

User = get_user_model()

class BadgeSerializer(serializers.ModelSerializer):
    unlocked = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()
    type = serializers.CharField(source='badge_type')
    icon = serializers.CharField(source='icon_svg')

    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'requirements', 'unlocked', 'progress', 'type', 'icon']

    def get_unlocked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress_obj = UserBadgeProgress.objects.filter(user=request.user, badge=obj).first()
            return progress_obj.unlocked if progress_obj else False
        return False

    def get_progress(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            progress_obj = UserBadgeProgress.objects.filter(user=request.user, badge=obj).first()
            return progress_obj.progress if progress_obj else 0
        return 0

class UserStatsSerializer(serializers.Serializer):
    tokens = serializers.IntegerField()
    badges = serializers.IntegerField()
    rank = serializers.IntegerField()

class BadgeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        earned_only = request.query_params.get('earned', '').lower() == 'true'
        badges = Badge.objects.all().order_by('id')
        
        if earned_only:
            unlocked_badge_ids = UserBadgeProgress.objects.filter(
                user=request.user, 
                unlocked=True
            ).values_list('badge_id', flat=True)
            badges = badges.filter(id__in=unlocked_badge_ids)
            
        serializer = BadgeSerializer(badges, many=True, context={'request': request})
        return Response(serializer.data)

class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Get token balance
        balance, created = TokenBalance.objects.get_or_create(user=user, defaults={'balance': 0})
        
        # Get badge count
        badge_count = UserBadgeProgress.objects.filter(user=user, unlocked=True).count()
        
        # Calculate rank based on token balance
        higher_users = TokenBalance.objects.filter(balance__gt=balance.balance).count()
        rank = higher_users + 1
        
        stats = {
            'tokens': balance.balance,
            'badges': badge_count,
            'rank': rank
        }
        
        serializer = UserStatsSerializer(stats)
        return Response(serializer.data)

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        top_users = TokenBalance.objects.select_related('user').order_by('-balance')[:10]
        
        leaderboard_data = []
        for idx, balance in enumerate(top_users, 1):
            leaderboard_data.append({
                'username': balance.user.username,
                'tokens': balance.balance,
                'rank': idx
            })
        
        return Response(leaderboard_data)

class TransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = TokenTransaction.objects.filter(user=request.user).order_by('-created_at')
        return Response([{
            'amount': t.amount,
            'reason': t.reason,
            'created_at': t.created_at
        } for t in transactions])
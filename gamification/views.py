from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Badge, AchievementLog, TokenTransaction, TokenBalance
from rest_framework import serializers

User = get_user_model()

class BadgeSerializer(serializers.ModelSerializer):
    earned = serializers.SerializerMethodField()

    class Meta:
        model = Badge
        fields = ['id', 'name', 'description', 'icon', 'earned']

    def get_earned(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return AchievementLog.objects.filter(user=request.user, badge=obj).exists()
        return False

class BadgeListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        earned_only = request.query_params.get('earned', '').lower() == 'true'
        badges = Badge.objects.all()
        
        if earned_only:
            earned_badges = AchievementLog.objects.filter(user=request.user).values_list('badge_id', flat=True)
            badges = badges.filter(id__in=earned_badges)
            
        serializer = BadgeSerializer(badges, many=True, context={'request': request})
        return Response(serializer.data)

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        top_users = TokenBalance.objects.select_related('user').order_by('-balance')[:10]
        return Response([{
            'username': balance.user.username,
            'balance': balance.balance
        } for balance in top_users])

class TransactionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = TokenTransaction.objects.filter(user=request.user).order_by('-created_at')
        return Response([{
            'amount': t.amount,
            'reason': t.reason,
            'created_at': t.created_at
        } for t in transactions])
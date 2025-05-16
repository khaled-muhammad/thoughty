from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Insight, ThinkingProfile
from .serializers import InsightSerializer, ThinkingProfileSerializer
from .tasks import generate_insights_for_user

# Create your views here.

class MentorProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        profile, _ = ThinkingProfile.objects.get_or_create(user=request.user)
        insights = Insight.objects.filter(user=request.user).order_by('-created_at')[:10]
        return Response({
            'profile': ThinkingProfileSerializer(profile).data,
            'insights': InsightSerializer(insights, many=True).data
        })

class GenerateInsightsView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        generate_insights_for_user.delay(request.user.id)
        return Response({'message': 'Insights generation started'})

class SuggestionView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({
            "books": [
                {"title": "Thinking, Fast and Slow", "link": "https://example.com"},
                {"title": "Atomic Habits", "link": "https://example.com"},
            ]
        })

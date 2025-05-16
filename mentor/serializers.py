from rest_framework import serializers
from .models import Insight, ThinkingProfile
from pods.serializers import TagSerializer

class InsightSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Insight
        fields = 'all'

class ThinkingProfileSerializer(serializers.ModelSerializer):
    dominant_tags = TagSerializer(many=True)

    class Meta:
        model = ThinkingProfile
        fields = ['user', 'dominant_tags', 'avg_stage_time']
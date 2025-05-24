from rest_framework import serializers
from django.utils import timezone

from .models import Battle, Vote

class BattleSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Battle
        fields = '__all__'
        read_only_fields = ['created_by', 'winner']

    def validate(self, data):
        if data['pod_a'] == data['pod_b']:
            raise serializers.ValidationError('A battle must be between two distinct pods.')
        return data
    
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user

        return super().create(validated_data)

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Vote
        fields = ['battle', 'voted_by', 'choice']
        read_only_field = ['voted_by']
    
    def validate(self, data):
        battle = data['battle']
        if battle.closes_at and battle.closes_at < timezone.now():
            raise serializers.ValidationError("Voting has ended for this battle.")
        return data
    
    def create(self, validated_data):
        validated_data['voted_by'] = self.context['request'].user
        return super().create(validated_data)
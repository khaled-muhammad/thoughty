from rest_framework import serializers
from .models import Prompt, RouletteSpin, Variation
from pods.models import Pod

class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ['id', 'text', 'type']

class RouletteSpinSerializer(serializers.ModelSerializer):
    prompt = PromptSerializer(read_only=True)
    prompt_id = serializers.PrimaryKeyRelatedField(
        queryset=Prompt.objects.all(),
        source='prompt',
        write_only=True,
    )
    
    class Meta:
        model = RouletteSpin
        fields = ['id', 'user', 'prompt', 'prompt_id', 'timestamp']
        read_only_fields = ['user', 'prompt', 'timestamp']
        
    def create(self, validated_data):
        # Ensure the user is set to the current user
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class VariationSerializer(serializers.ModelSerializer):
    prompt = PromptSerializer(read_only=True)
    prompt_id = serializers.PrimaryKeyRelatedField(
        queryset=Prompt.objects.all(),
        source='prompt',
        write_only=True
    )
    
    class Meta:
        model = Variation
        fields = ['id', 'prompt', 'prompt_id', 'text', 'created_by_ai']
        read_only_fields = ['created_by_ai']
        
    def validate_text(self, value):
        """Ensure text is meaningful."""
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Variation text must be meaningful.")
        return value
from rest_framework import serializers
from .models import Pod, PodStageHistory, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class PodStageHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = PodStageHistory
        fields = ['version', 'content', 'timestamp']

class PodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pod
        fields = [
            'id', 'user', 'title', 'content', 'stage',
            'version', 'is_public', 'tags', 'history',
            'created_at', 'timestamp',
        ]

        read_only_fields = ['user', 'version', 'history', 'created_at', 'timestamp']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        pod       = Pod.objects.create(**validated_data, user=self.context['request'].user)

        for tag in tags_data:
            t, _ = Tag.objects.get_or_create(**tag)
            pod.tags.add(t)
        
        return pod
    
    def update(self, instance, validated_data):
        # If stage changes, archive old content & bump version
        new_stage = validated_data.get('stage', instance.stage)
        if new_stage != instance.stage:
            PodStageHistory.objects.create(
                pod=instance,
                version=instance.version,
                content=instance.content
            )

            instance.version += 1
            instance.stage = new_stage
        
        # Update title/content/tags
        instance.title   = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        if 'tags' in validated_data:
            instance.tags.clear()
            for tag in validated_data['tags']:
                t, _ = Tag.objects.get_or_create(**tag)
                instance.tags.add(t)
        
        instance.save()

        return instance
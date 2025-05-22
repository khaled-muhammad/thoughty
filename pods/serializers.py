from rest_framework import serializers
from .models import Pod, PodStageHistory, Tag

class TagSerializer(serializers.ModelSerializer):
    """Serializer for the Tag model"""
    class Meta:
        model = Tag
        fields = ['id', 'name']

class PodStageHistorySerializer(serializers.ModelSerializer):
    """Serializer for the PodStageHistory model"""
    class Meta:
        model = PodStageHistory
        fields = ['version', 'content', 'timestamp']

class PodSerializer(serializers.ModelSerializer):
    """
    Serializer for the Pod model.
    Handles creation, updating, and proper versioning of pods.
    """
    tags = TagSerializer(many=True, required=False)
    history = PodStageHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Pod
        fields = [
            'id', 'user', 'title', 'content', 'stage',
            'version', 'is_public', 'tags', 'history',
            'created_at', 'timestamp',
        ]
        read_only_fields = ['user', 'version', 'created_at', 'timestamp']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        pod = Pod.objects.create(**validated_data, user=self.context['request'].user)

        # Process tags
        self._process_tags(pod, tags_data)
        
        return pod
    
    def update(self, instance, validated_data):
        # If stage changes, archive old content & bump version
        new_stage = validated_data.get('stage', instance.stage)
        if new_stage != instance.stage:
            # Create version string in format: 1.0.0
            version_str = f"{instance.version}.0.0"
            
            PodStageHistory.objects.create(
                pod=instance,
                version=version_str,
                content=instance.content
            )

            instance.version += 1
            instance.stage = new_stage
        
        # Update title/content
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.is_public = validated_data.get('is_public', instance.is_public)
        
        # Process tags if provided
        if 'tags' in validated_data:
            instance.tags.clear()
            self._process_tags(instance, validated_data['tags'])
        
        instance.save()
        return instance
        
    def _process_tags(self, pod, tags_data):
        """Helper method to process tags for both create and update operations"""
        for tag_data in tags_data:
            if isinstance(tag_data, dict):
                # If we received a dictionary with tag data
                tag_name = tag_data.get('name')
                if tag_name:
                    tag, _ = Tag.objects.get_or_create(name=tag_name)
                    pod.tags.add(tag)
            else:
                # If we received just a tag ID
                try:
                    tag = Tag.objects.get(id=tag_data)
                    pod.tags.add(tag)
                except (Tag.DoesNotExist, ValueError):
                    pass
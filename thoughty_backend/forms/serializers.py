from rest_framework import serializers
from .models import ContactMessage, NewsletterSubscription

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
        
    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value.strip()
    
    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return value.strip()

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'subscribed_at', 'is_active']
        read_only_fields = ['id', 'subscribed_at', 'is_active']
        
    def validate_email(self, value):
        # Check if email is already subscribed and active
        existing = NewsletterSubscription.objects.filter(email=value, is_active=True).first()
        if existing:
            raise serializers.ValidationError("This email is already subscribed to our newsletter.")
        return value.lower().strip() 
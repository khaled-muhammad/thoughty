from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'avatar', 'is_guest', 'bio', 'tokens', 'badges', 'birth_date', 'date_joined')

class CustomLoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)  # Can be email or username
    password = serializers.CharField(max_length=255, style={'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            # Try to authenticate with email first
            user = None
            
            # Check if login field contains '@' (likely email)
            if '@' in username:
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(username=user_obj.email, password=password)
                except User.DoesNotExist:
                    pass
            else:
                # Try username authentication
                try:
                    user_obj = User.objects.get(username=username)
                    user = authenticate(username=user_obj.email, password=password)  # Still use email for auth
                except User.DoesNotExist:
                    pass

            if not user:
                # If both failed, try the login field as-is with Django's default authenticate
                user = authenticate(username=username, password=password)

            if not user:
                raise serializers.ValidationError('Invalid credentials. Please check your email/username and password.')

            if not user.is_active:
                raise serializers.ValidationError('This account has been deactivated.')

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include "login" and "password" fields.')
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import CustomLoginSerializer, UserSerializer

# Create your views here.

@api_view(['POST'])
def create_guest_user(request):
    guest = User.objects.create_user(
        username=f"guest_{User.objects.count()}",
        email=f"guest{User.objects.count()}@thoughty.io",
        password=User.make_random_password(),
        is_guest=True
    )
    refresh = RefreshToken.for_user(guest)

    return Response({"detail": "Guest user created", "id": guest.id, "access": str(refresh.access_token), "refresh": str(refresh), "email": guest.email}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def custom_login(request):
    """
    Custom login endpoint that accepts both email and username
    Returns access token, refresh token, and user data
    """
    serializer = CustomLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        # Serialize user data
        user_serializer = UserSerializer(user)
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': user_serializer.data
            }
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Login failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def refresh_token(request):
    """
    Refresh token endpoint to get new access token
    """
    refresh_token = request.data.get('refresh')
    
    if not refresh_token:
        return Response({
            'success': False,
            'message': 'Refresh token is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        refresh = RefreshToken(refresh_token)
        new_token = refresh.access_token
        
        return Response({
            'success': True,
            'message': 'Token refreshed successfully',
            'data': {
                'access': str(new_token)
            }
        }, status=status.HTTP_200_OK)
    
    except TokenError as e:
        return Response({
            'success': False,
            'message': 'Invalid or expired refresh token'
        }, status=status.HTTP_401_UNAUTHORIZED)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

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
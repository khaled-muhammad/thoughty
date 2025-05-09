from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User
from rest_framework import status

# Create your views here.

@api_view(['POST'])
def create_guest_user(request):
    guest = User.objects.create_user(
        username=f"guest_{User.objects.count()}",
        email=f"guest{User.objects.count()}@thoughty.io",
        password=User.objects.make_random_password(),
        is_guest=True
    )
    return Response({"detail": "Guest user created", "id": guest.id}, status=status.HTTP_201_CREATED)
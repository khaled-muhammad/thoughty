from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Pod
from .serializers import PodSerializer

# Create your views here.

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    Read access is granted to all users for public pods, but only owners can see private pods.
    """
    def has_object_permission(self, request, view, obj):
        # Read: anyone if public; Write: only owner
        if request.method in permissions.SAFE_METHODS:
            return obj.is_public or obj.user == request.user
        
        return obj.user == request.user

class PodViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing Pod instances.
    Automatically handles permissions and filtering based on user authentication.
    """
    queryset = Pod.objects.all().select_related('user').prefetch_related('tags', 'history')
    serializer_class = PodSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        """
        Filter queryset based on authentication:
        - Authenticated users see all public pods and their own private pods
        - Anonymous users see only public pods
        """
        user = self.request.user
        qs = super().get_queryset()

        if user.is_authenticated:
            return qs.filter(Q(is_public=True) | Q(user=user))
        return qs.filter(is_public=True)
    
    def perform_create(self, serializer):
        """User is automatically set by the serializer"""
        serializer.save()
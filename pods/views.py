from rest_framework import viewsets, permissions
from .models import Pod
from .serializers import PodSerializer

# Create your views here.

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read: anyone if public; Write: only owner
        if request.method in permissions.SAFE_METHODS:
            return obj.is_public or obj.user == request.user
        
        return obj.user == request.user

class PodViewSet(viewsets.ModelViewSet):
    queryset           = Pod.objects.all().select_related('user').prefetch_related('tags', 'history')
    serializer_class   = PodSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        qs   = super().get_queryset()

        #public pods always are visible, private are only ur own ...
        if user.is_authenticated:
            return qs.filter(models.Q(is_public=True) | models.Q(user=user))
        return qs.filter(is_public=True)
    
    def perform_create(self, serializer):
        #user is set
        serializer.save()
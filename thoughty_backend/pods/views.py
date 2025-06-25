from rest_framework import viewsets, permissions
from django.db.models import Q, Count
from .models import Pod, Tag
from .serializers import PodSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

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

    # Add custom collection endpoints -------------
    @action(detail=False, methods=['get'], url_path='trending')
    def trending(self, request):
        """Return pods that are currently trending based on recent vote activity."""
        # Consider votes from the last 7 days only
        since = timezone.now() - timedelta(days=7)

        queryset = (
            self.get_queryset()
            .filter(is_public=True)
            .annotate(
                recent_votes=Count(
                    'vote',  # reverse relation from Vote.choice to Pod (no related_name specified)
                    filter=Q(vote__voted_at__gte=since)
                )
            )
            .order_by('-recent_votes', '-timestamp')[:20]
        )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='new')
    def new(self, request):
        """Return the newest public pods."""
        queryset = self.get_queryset().filter(is_public=True).order_by('-created_at')[:20]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='recommended', permission_classes=[permissions.IsAuthenticated])
    def recommended(self, request):
        """Return pods recommended for the authenticated user based on overlapping tags."""
        user = request.user
        # Get tags used by the user's own pods
        user_tag_ids = (
            Tag.objects.filter(pod__user=user).values_list('id', flat=True).distinct()
        )

        queryset = (
            self.get_queryset()
            .filter(is_public=True, tags__in=user_tag_ids)
            .exclude(user=user)
            .distinct()
            .order_by('-timestamp')[:20]
        )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='mine', permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        """Return only pods created by the authenticated user (regardless of public/private)."""
        queryset = self.get_queryset().filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
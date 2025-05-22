import random
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import action
from django.db import transaction

from .models import Prompt, RouletteSpin, Variation
from .serializers import PromptSerializer, RouletteSpinSerializer, VariationSerializer
from pods.models import Pod
from pods.serializers import PodSerializer
from .ai_service import AIVariationGenerator

from thoughty.permissions import IsOwnerOrReadOnly
from .permissions import IsPromptVariationCreator

# Create your views here.

class PromptViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows prompts to be viewed.
    Prompts can only be created, updated or deleted by staff.
    """

    queryset           = Prompt.objects.all()
    serializer_class   = PromptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def add_to_history(self, request, pk=None):
        """Record that a user has viewed this prompt."""
        prompt = self.get_object()
        spin   = RouletteSpin.objects.create(user=request.user, prompt=prompt)
        return Response({'status': 'prompt added to history'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def generate_variations(self, request, pk=None):
        """Generate AI variations for a prompt"""
        prompt = self.get_object()
        
        # Get parameters
        count = int(request.data.get('count', 3))
        count = min(max(1, count), 5) # Limit between 1-5 variations

        # Generate variations
        ai_service = AIVariationGenerator()
        variations_text = ai_service.generate_variations(
            prompt_text=prompt.text,
            prompt_type=prompt.type,
            count=count
        )

        if not variations_text:
            return Response(
                {"detail": "Failed to generate variations"}, 
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
    
        # Save the variations
        variations = []
        with transaction.atomic():
            # Record that user has seen this prompt
            RouletteSpin.objects.get_or_create(
                user=request.user,
                prompt=prompt,
                defaults={'timestamp': timezone.now()}
            )

            # Create variation objects
            for text in variations_text:
                variation = Variation.objects.create(
                    prompt=prompt,
                    text=text,
                    created_by_ai = True,
                )
                variations.append(variation)
            
        # Return the created variations
        serializer = VariationSerializer(variations, many=True)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def spin_roulette(request):
    """
    Spin the roulette to get a random prompt.
    Requires authentication.
    """
    prompts = list(Prompt.objects.all())
    if not prompts:
        return Response({'detail': 'No prompts available.'}, status=status.HTTP_404_NOT_FOUND)
    prompt = random.choice(prompts)
    spin   = RouletteSpin.objects.create(user=request.user, prompt=prompt)
    serializer = PromptSerializer(prompt)
    return Response(serializer.data, status=status.HTTP_200_OK)

class VariationListCreateView(generics.ListCreateAPIView):
    """
    API endpoint for listing and creating variations.
    GET: List variations (public)
    POST: Create a new variation (authenticated only)
    """
    queryset           = Variation.objects.all()
    serializer_class   = VariationSerializer
    permission_classes = [IsPromptVariationCreator]

    def perform_create(self, serializer):
        """When creating a variation, mark it as user-created."""
        serializer.save(created_by_ai=False)
    
    def get_queryset(self):
        """Filter variations by prompt_id if provided in query params."""

        queryset  = super().get_queryset()
        prompt_id = self.request.query_params.get('prompt_id')

        if prompt_id:
            queryset = queryset.filter(prompt_id=prompt_id)
        
        return queryset

class VariationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint for a specific variation.
    Only the creator can update/delete a variation.
    """
    queryset = Variation.objects.all()
    serializer_class = VariationSerializer
    permission_classes = [IsOwnerOrReadOnly]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_pod_from_variation(request):
    """
    Create a new pod from a variation.
    Requires authentication and the variation must exist.
    """
    variation_id = request.data.get('variation_id')
    if not variation_id:
        return Response({'detail': 'Variation ID is required.'}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    variation = get_object_or_404(Variation, pk=variation_id)
    
    # Optionally check if user has access to this variation
    if request.user.is_authenticated:
        # Record that user interacted with this prompt
        RouletteSpin.objects.get_or_create(
            user=request.user, 
            prompt=variation.prompt,
            defaults={'timestamp': timezone.now()}
        )
    
    pod = Pod.objects.create(
        user=request.user,
        title=f"From variation: {variation.prompt.text}",
        content=variation.text,
        is_public=False
    )
    serializer = PodSerializer(pod)

    return Response(serializer.data, status=status.HTTP_201_CREATED)
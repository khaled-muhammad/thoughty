import random
from rest_framework import viewsets, generics, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Prompt, RouletteSpin, Variation
from .serializers import PromptSerializer, RouletteSpinSerializer, VariationSerializer
from pods.models import Pod
from pods.serializers import PodSerializer

# Create your views here.

class PromptViewSet(viewsets.ReadOnlyModelViewSet):
    queryset           = Prompt.objects.all()
    serializer_class   = PromptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def spin_roulette(request):
    prompts = list(Prompt.objects.all())
    if not prompts:
        return Response({'detail': 'No prompts available.'}, status=status.HTTP_404_NOT_FOUND)
    prompt = random.choice(prompts)
    spin   = RouletteSpin.objects.create(user=request.user, prompt=prompt)
    serializer = PromptSerializer(prompt)
    return serializer.data

class VariationListCreateView(generics.ListCreateAPIView):
    queryset           = Variation.objects.all()
    serializer_class   = VariationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_pod_from_variation(request):
    variation_id = request.data.get('variation_id')
    try:
        variation = Variation.objects.get(pk=variation_id)
    except Variation.DoesNotExist:
        return Response({'detail': 'Variation not found.'}, status=status.HTTP_404_NOT_FOUND)
    pod = Pod.objects.create(
        user=request.user,
        title=f"From variation: {variation.prompt.text}",
        content = variation.text,
        is_public = False
    )
    serializer = PodSerializer(pod)

    return Response(serializer.data, status=status.HTTP_201_CREATED)
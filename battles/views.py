from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count

from .models import Battle, Vote
from .serializers import BattleSerializer, VoteSerializer

# Create your views here.

class BattleViewSet(viewsets.ModelViewSet):
    queryset           = Battle.objects.all().select_related('pod_a', 'pod_b')
    serializer_class   = BattleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        return serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        battle = self.get_object()
        votes  = Vote.objects.filter(battle=battle).values('choice').annotate(count=Count('id'))
        return Response({v['choice']: v['count'] for v in votes})

class VoteCreateView(generics.CreateAPIView):
    serializer_class   = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]
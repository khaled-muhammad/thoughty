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

    @action(detail=True, methods=['get'], url_path='ai-verdict')
    def ai_verdict(self, request, pk=None):
        """
        Return an AI-style verdict: who won and a brief reasoning.
        """
        battle = self.get_object()

        # If no winner yet, optionally run closure logic
        if not battle.winner:
            # you could trigger closure here or return 204
            return Response({"detail": "Battle not closed yet."}, status=204)
        
        # Basic vote summary
        votes = Vote.objects.filter(battle=battle).values('choice').annotate(count=models.Count('id'))
        counts = {v['choice']: v['count'] for v in votes}
        a_votes = counts.get(battle.pod_a.id, 0)
        b_votes = counts.get(battle.pod_b.id, 0)

        # Fake "AI reasoning"
        reasoning = []
        reasoning.append(
            f"Pod “{battle.pod_a.title}” received {a_votes} votes; "
            f"Pod “{battle.pod_b.title}” received {b_votes} votes."
        )
        reasoning.append(f"The community favored “{battle.winner.title}” by {abs(a_votes - b_votes)} votes.")
        reasoning.append("Insight: The more concise argument tended to resonate better.")

        return Response({
            "winner_pod": battle.winner.id,
            "winner_title": battle.winner.title,
            "reasoning": reasoning
        })

class VoteCreateView(generics.CreateAPIView):
    serializer_class   = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]
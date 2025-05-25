from rest_framework import viewsets, generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count
import logging

from .models import Battle, Vote
from .serializers import BattleSerializer, VoteSerializer
from .ai_service import BattleAIJudge

logger = logging.getLogger(__name__)

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
        Return an AI-powered verdict analyzing the battle content and voting patterns.
        """
        battle = self.get_object()

        try:
            # Initialize AI judge
            ai_judge = BattleAIJudge()
            
            # Generate AI verdict
            verdict = ai_judge.generate_verdict(battle)
            
            # Update battle winner if not already set
            if not battle.winner and verdict.get("winner_pod"):
                from .models import Pod
                try:
                    winner_pod = Pod.objects.get(id=verdict["winner_pod"])
                    battle.winner = winner_pod
                    battle.save()
                    logger.info(f"Battle {battle.id} winner set to Pod {winner_pod.id} by AI verdict")
                except Pod.DoesNotExist:
                    logger.error(f"Winner pod {verdict['winner_pod']} not found for battle {battle.id}")
            
            # Add additional context to the response
            response_data = {
                **verdict,
                "battle_id": battle.id,
                "battle_title": f"{battle.pod_a.title} vs {battle.pod_b.title}",
                "created_at": battle.created_at,
                "total_votes": len(Vote.objects.filter(battle=battle)),
                "ai_powered": True
            }
            
            return Response(response_data)
            
        except Exception as e:
            logger.error(f"Error generating AI verdict for battle {battle.id}: {str(e)}")
            
            # Fallback to basic vote-based analysis
            votes = Vote.objects.filter(battle=battle).values('choice').annotate(count=Count('id'))
            counts = {v['choice']: v['count'] for v in votes}
            a_votes = counts.get(battle.pod_a.id, 0)
            b_votes = counts.get(battle.pod_b.id, 0)
            
            # Determine winner based on votes
            if a_votes > b_votes:
                winner = battle.pod_a
            elif b_votes > a_votes:
                winner = battle.pod_b
            else:
                winner = None
            
            # Update battle winner if not set
            if not battle.winner and winner:
                battle.winner = winner
                battle.save()
            
            fallback_response = {
                "winner_pod": winner.id if winner else None,
                "winner_title": winner.title if winner else "Tie",
                "reasoning": [
                    f"Pod A ({battle.pod_a.title}) received {a_votes} votes",
                    f"Pod B ({battle.pod_b.title}) received {b_votes} votes",
                    "Winner determined by community voting (AI analysis unavailable)"
                ],
                "analysis": "Vote-based analysis due to AI service error",
                "vote_summary": f"Pod A: {a_votes} votes, Pod B: {b_votes} votes",
                "battle_id": battle.id,
                "battle_title": f"{battle.pod_a.title} vs {battle.pod_b.title}",
                "ai_powered": False,
                "error": "AI analysis unavailable"
            }
            
            return Response(fallback_response)

class VoteCreateView(generics.CreateAPIView):
    serializer_class   = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]
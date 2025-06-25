import json
import os
import logging
from django.conf import settings
from django.db import models
from groq import Groq

logger = logging.getLogger(__name__)

class BattleAIJudge:
    """AI service to provide intelligent verdicts on battles between pods"""

    def __init__(self):
        # Get API key from settings
        self.api_key = getattr(settings, 'GROQ_API_KEY', os.environ.get('GROQ_API_KEY'))
        if not self.api_key:
            logger.warning("GROQ API key not configured!")
        self.client = Groq(api_key=self.api_key)
    
    def generate_verdict(self, battle):
        """
        Generate an AI verdict for a battle between two pods
        
        Args:
            battle: Battle model instance with pod_a, pod_b, and votes
            
        Returns:
            Dict with winner analysis, reasoning, and insights
        """
        if not self.api_key:
            logger.error("Cannot generate verdict: No API key")
            return self._fallback_verdict(battle)
        
        try:
            # Get vote counts
            from .models import Vote
            votes = Vote.objects.filter(battle=battle).values('choice').annotate(count=models.Count('id'))
            vote_counts = {v['choice']: v['count'] for v in votes}
            a_votes = vote_counts.get(battle.pod_a.id, 0)
            b_votes = vote_counts.get(battle.pod_b.id, 0)
            
            # Prepare battle context
            battle_context = self._prepare_battle_context(battle, a_votes, b_votes)
            
            # Get AI analysis
            system_prompt = self._get_system_prompt()
            
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": battle_context}
                ],
                max_tokens=800,
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            
            # Parse AI response
            ai_verdict = json.loads(response.choices[0].message.content)
            
            # Determine winner based on AI analysis and votes
            winner_pod = self._determine_winner(battle, ai_verdict, a_votes, b_votes)
            
            return {
                "winner_pod": winner_pod.id if winner_pod else None,
                "winner_title": winner_pod.title if winner_pod else "Tie",
                "reasoning": ai_verdict.get("reasoning", []),
                "analysis": ai_verdict.get("analysis", ""),
                "key_factors": ai_verdict.get("key_factors", []),
                "vote_summary": f"Pod A: {a_votes} votes, Pod B: {b_votes} votes",
                "ai_confidence": ai_verdict.get("confidence", "medium")
            }
            
        except Exception as e:
            logger.error(f"Error generating AI verdict: {str(e)}")
            return self._fallback_verdict(battle)
    
    def _prepare_battle_context(self, battle, a_votes, b_votes):
        """Prepare the battle context for AI analysis"""
        
        context = f"""
BATTLE ANALYSIS REQUEST

Battle Overview:
- Battle ID: {battle.id}
- Created: {battle.created_at}
- Vote Threshold: {battle.vote_threshold}

Pod A: "{battle.pod_a.title}"
Content: {battle.pod_a.content}
Stage: {battle.pod_a.stage}
Tags: {', '.join([tag.name for tag in battle.pod_a.tags.all()]) or 'None'}
Votes Received: {a_votes}

Pod B: "{battle.pod_b.title}"
Content: {battle.pod_b.content}
Stage: {battle.pod_b.stage}
Tags: {', '.join([tag.name for tag in battle.pod_b.tags.all()]) or 'None'}
Votes Received: {b_votes}

Voting Results:
- Total Votes: {a_votes + b_votes}
- Pod A Votes: {a_votes}
- Pod B Votes: {b_votes}
- Vote Difference: {abs(a_votes - b_votes)}

Please analyze this battle and provide your verdict.
"""
        return context
    
    def _get_system_prompt(self):
        """Get the system prompt for AI battle analysis"""
        
        return """You are an expert AI judge analyzing battles between thought pods (ideas, concepts, or arguments). Your role is to provide fair, insightful analysis that considers both the content quality and community voting patterns.

Analysis Criteria:
1. Content Quality: Clarity, depth, originality, and practical value
2. Argument Strength: Logic, evidence, and persuasiveness  
3. Relevance: How well the content addresses the topic
4. Innovation: Novel approaches or perspectives
5. Community Response: Voting patterns and engagement

Your verdict should:
- Be objective and balanced
- Consider both content merit AND community voting
- Provide educational insights
- Acknowledge strengths in both pods
- Explain the reasoning clearly

Respond ONLY with JSON in this exact format:
{
    "analysis": "Overall battle analysis in 2-3 sentences",
    "reasoning": [
        "Specific reason 1 for the outcome",
        "Specific reason 2 for the outcome", 
        "Specific reason 3 for the outcome"
    ],
    "key_factors": [
        "Important factor 1",
        "Important factor 2"
    ],
    "recommended_winner": "A or B or TIE",
    "confidence": "high, medium, or low",
    "pod_a_strengths": ["strength 1", "strength 2"],
    "pod_b_strengths": ["strength 1", "strength 2"],
    "learning_insights": ["insight 1", "insight 2"]
}"""
    
    def _determine_winner(self, battle, ai_verdict, a_votes, b_votes):
        """Determine the final winner based on AI analysis and community votes"""
        
        ai_recommendation = ai_verdict.get("recommended_winner", "TIE")
        
        # If there's a clear vote winner and AI agrees or is neutral
        if a_votes > b_votes and ai_recommendation in ["A", "TIE"]:
            return battle.pod_a
        elif b_votes > a_votes and ai_recommendation in ["B", "TIE"]:
            return battle.pod_b
        # If AI has a strong opinion that differs from votes
        elif ai_recommendation == "A" and ai_verdict.get("confidence") == "high":
            return battle.pod_a
        elif ai_recommendation == "B" and ai_verdict.get("confidence") == "high":
            return battle.pod_b
        # Tie scenarios
        elif a_votes == b_votes:
            if ai_recommendation == "A":
                return battle.pod_a
            elif ai_recommendation == "B":
                return battle.pod_b
            else:
                return None  # True tie
        # Default to vote winner
        elif a_votes > b_votes:
            return battle.pod_a
        elif b_votes > a_votes:
            return battle.pod_b
        else:
            return None
    
    def _fallback_verdict(self, battle):
        """Fallback verdict when AI service is unavailable"""
        
        from .models import Vote
        from django.db import models
        
        votes = Vote.objects.filter(battle=battle).values('choice').annotate(count=models.Count('id'))
        vote_counts = {v['choice']: v['count'] for v in votes}
        a_votes = vote_counts.get(battle.pod_a.id, 0)
        b_votes = vote_counts.get(battle.pod_b.id, 0)
        
        if a_votes > b_votes:
            winner = battle.pod_a
        elif b_votes > a_votes:
            winner = battle.pod_b
        else:
            winner = None
        
        return {
            "winner_pod": winner.id if winner else None,
            "winner_title": winner.title if winner else "Tie",
            "reasoning": [
                f"Pod A received {a_votes} votes",
                f"Pod B received {b_votes} votes",
                "Winner determined by community voting (AI analysis unavailable)"
            ],
            "analysis": "Basic vote-based analysis",
            "key_factors": ["Community voting patterns"],
            "vote_summary": f"Pod A: {a_votes} votes, Pod B: {b_votes} votes",
            "ai_confidence": "n/a"
        }
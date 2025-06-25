from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.utils import timezone
from .models import Battle, Vote
from django.conf import settings

@receiver(post_save, sender=Vote)
def check_battle_closure(sender, instance, created, **kwargs):
    """
    Whenever a vote is cast:
    - Count votes.
    - If vote count ≥ vote_threshold or closes_at passed -> determine winner.
    - Award tokens to battle.winner.user.
    """

    battle = instance.battle
    if battle.winner:
        return  # already closed
    
    total_votes     = battle.votes.count()
    deadline_passed = battle.closes_at and timezone.now() >= battle.closes_at

    if total_votes >= battle.vote_threshold or deadline_passed:
        # Determine and set winner
        winner_pod = battle.determine_winner()
        battle.winner = winner_pod
        battle.save(update_fields=['winner'])

        # Award tokens
        winner_user = winner_pod.user

        # Adjust token amount as you see fit:
        winner_user.tokens += 50
        winner_user.save(update_fields=['tokens'])
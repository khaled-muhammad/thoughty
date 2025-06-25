from django.db.models.signals import post_save
from django.dispatch import receiver
from pods.models import Pod
from .models import TokenTransaction, TokenBalance, Badge, AchievementLog
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=Pod)
def handle_pod_creation(sender, instance, created, **kwargs):
    if created:
        # Award tokens for pod creation
        TokenTransaction.objects.create(
            user=instance.user,
            amount=10,
            reason="Pod Creation"
        )
        # Update balance
        balance, _ = TokenBalance.objects.get_or_create(user=instance.user)
        balance.balance += 10
        balance.save()
        
        # Evaluate badges
        evaluate_badges(instance.user)

def evaluate_badges(user):
    """Evaluate all badge conditions for a user"""
    for badge in Badge.objects.all():
        # Skip if user already has this badge
        if AchievementLog.objects.filter(user=user, badge=badge).exists():
            continue
            
        # Evaluate condition_code (this is a placeholder - you'll need to implement
        # proper evaluation logic based on your condition_code format)
        try:
            if eval(badge.condition_code):
                AchievementLog.objects.create(user=user, badge=badge)
        except:
            pass  # Handle evaluation errors gracefully
from django.db.models.signals import post_save
from django.dispatch import receiver
from pods.models import Pod
from .tasks import analyze_pod_for_insights

@receiver(post_save, sender=Pod)
def handle_new_pod(sender, instance, created, **kwargs):
    if created:
        analyze_pod_for_insights.delay(instance.id)
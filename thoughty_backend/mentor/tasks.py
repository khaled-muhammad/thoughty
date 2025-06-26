# Celery has been removed for local development – tasks run synchronously.
# If you re-enable Celery later, just add the decorator back.

from .models import Insight, ThinkingProfile
from pods.models import Pod
from django.contrib.auth import get_user_model
import random

def analyze_pod_for_insights(pod_id):
    try:
        pod = Pod.objects.get(id=pod_id)
        text = pod.content.lower()

        sample_insight = "What triggered this line of thinking?"
        Insight.objects.create(user=pod.user, pod=pod, text=sample_insight, type='reflection')

    except Pod.DoesNotExist:
        pass

def generate_insights_for_user(user_id):
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        recent_pods = Pod.objects.filter(user=user).order_by('-created_at')[:5]
        for pod in recent_pods:
            analyze_pod_for_insights(pod.id)
    except User.DoesNotExist:
        pass
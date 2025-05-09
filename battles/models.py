from django.db import models
from django.conf import settings

from pods.models import Pod

# Create your models here.

class Battle(models.Model):
    pod_a           = models.ForeignKey(Pod, related_name='pod_a', on_delete=models.CASCADE)
    pod_b           = models.ForeignKey(Pod, related_name='pod_b', on_delete=models.CASCADE)
    created_by      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at      = models.DateTimeField(auto_now_add=True)
    timestamp       = models.DateTimeField(auto_now=True)
    winner          = models.ForeignKey(Pod, related_name='won_battles', on_delete=models.SET_NULL, null=True, blank=True)
    vote_threshold  = models.PositiveIntegerField(default=3)
    closes_at       = models.DateTimeField(null=True, blank=True)

    def determine_winner(self):
        votes = self.votes.values('choice').annotate(count=models.Count('id'))
        if not votes:
            return None
        top = max(votes, key=lambda x: x['count'])
        return Pod.objects.get(pk=top['choice'])

class Vote(models.Model):
    battle   = models.ForeignKey(Battle, related_name='votes', on_delete=models.CASCADE)
    voted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    choice   = models.ForeignKey(Pod, on_delete=models.CASCADE)
    voted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('battle', 'voted_by')
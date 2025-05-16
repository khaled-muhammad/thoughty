from django.db import models
from django.conf import settings

from pods.models import Pod

# Create your models here.
class Insight(models.Model):
    INSIGHT_TYPES = [
        ('reflection', 'Reflection'),
        ('growth_tip', 'Growth Tip'),
        ('prompt', 'Prompt'),
        ('book', 'Book Recommendation'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    pod  = models.ForeignKey(Pod, on_delete=models.CASCADE)
    text = models.TextField()
    type = models.CharField(max_length=20, choices=INSIGHT_TYPES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.type} for {self.user.username}'

class ThinkingProfile(models.Model):
    user           = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    dominant_tags  = models.ManyToManyField('pods.Tag', blank=True)
    avg_stage_time = models.DurationField(null=True, blank=True)

    def __str__(self):
        return f'Thinking Profile of {self.user.username}'

import re
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

# Create your models here.

def validate_version(value):
    version_regex = r'^(\d+)\.(\d+)\.(\d+)(\+(\d+))?$'
    match = re.match(version_regex, value)

    if not match:
        raise ValidationError(f'{value} is not a valid version format.')
    
class Stage(models.TextChoices):
    IDEA   = 'idea', 'Idea'
    DRAFT  = 'draft', 'Draft'
    REVIEW = 'review', 'Review'
    FINAL  = 'final', 'Final'

class Pod(models.Model):
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title      = models.CharField(max_length=150)
    content    = models.TextField(max_length=500)
    stage      = models.CharField(choices=Stage.choices, max_length=20, default=Stage.IDEA)
    tags       = models.ManyToManyField('Tag', blank=True)
    version    = models.IntegerField(default=1)
    is_public  = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    timestamp  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"

    class Meta:
        ordering = ['-timestamp']

class PodStageHistory(models.Model):
    pod        = models.ForeignKey(Pod, on_delete=models.CASCADE)
    version    = models.CharField(max_length=20, unique=True, validators=[validate_version])
    content    = models.TextField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    timestamp  = models.DateTimeField(auto_now=True)

class Tag(models.Model):
    name = models.CharField(max_length=100)
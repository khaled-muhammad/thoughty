from django.db import models
from django.conf import settings

# Create your models here.

class Prompt(models.Model):
    TYPE_CHOICES = [
        ('idea', 'Idea Prompt'),
        ('title', 'Title Prompt'),
        ('quote', 'Quote Prompt'),
        ('question', 'Deep Question'), 
        ('problem', 'Problem Statement'),
        ('challenge', 'Challenge Prompt'),
        ('perspective', 'New Perspective')
    ]

    text        = models.TextField(max_length=500)
    type        = models.CharField(max_length=100, choices=TYPE_CHOICES)
    difficulty  = models.CharField(max_length=20, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ], default='intermediate')
    tags = models.ManyToManyField('pods.Tag', blank=True)

    def __str__(self):
        return f"[{self.get_type_display()}] {self.text}"

class RouletteSpin(models.Model):
    user      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    prompt    = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Variation(models.Model):
    prompt        = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    text          = models.TextField()
    user          = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    created_by_ai = models.BooleanField(default=True)

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

BADGE_TYPES = [
    ('starter', 'Starter'),
    ('consistent', 'Consistent'),
    ('explorer', 'Explorer'),
    ('master', 'Master'),
    ('achievement', 'Achievement'),
    ('dedication', 'Dedication'),
    ('community', 'Community'),
    ('legendary', 'Legendary'),
]

class Badge(models.Model):
    name           = models.CharField(max_length=100)
    description    = models.TextField()
    requirements   = models.TextField()
    icon           = models.ImageField(upload_to='badges/', blank=True, null=True)  # Optional image
    icon_svg       = models.TextField()  # SVG path for the icon
    badge_type     = models.CharField(max_length=20, choices=BADGE_TYPES, default='starter')
    condition_code = models.TextField()

    def __str__(self):
        return self.name

class UserBadgeProgress(models.Model):
    user           = models.ForeignKey(User, on_delete=models.CASCADE)
    badge          = models.ForeignKey(Badge, on_delete=models.CASCADE)
    progress       = models.IntegerField(default=0)  # Progress percentage (0-100)
    unlocked       = models.BooleanField(default=False)
    unlocked_at    = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'badge']

    def __str__(self):
        return f"{self.user.username} - {self.badge.name} ({self.progress}%)"

class AchievementLog(models.Model):
    user           = models.ForeignKey(User, on_delete=models.CASCADE)
    badge          = models.ForeignKey(Badge, on_delete=models.CASCADE)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"

class TokenTransaction(models.Model):
    user           = models.ForeignKey(User, on_delete=models.CASCADE)
    amount         = models.IntegerField()
    reason         = models.CharField(max_length=100)
    created_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.reason}"

class TokenBalance(models.Model):
    user           = models.OneToOneField(User, on_delete=models.CASCADE)
    balance        = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user.username} - {self.balance}"

from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

# Create your models here.

class Badge(models.Model):
    name           = models.CharField(max_length=100)
    description    = models.TextField()
    icon           = models.ImageField(upload_to='badges/')
    condition_code = models.TextField()

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

from django.contrib.auth.models import AbstractUser
from django.db import models
import secrets

# Create your models here.

class User(AbstractUser):
    email      = models.EmailField(unique=True)
    avatar     = models.ImageField(upload_to='avatars/', null=True, blank=True)
    is_guest   = models.BooleanField(default=False)
    bio        = models.TextField(blank=True)
    tokens     = models.IntegerField(default=0) # gamification
    badges     = models.ManyToManyField('gamification.Badge', blank=True)
    birth_date = models.DateField(null=True, blank=True)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']

    @staticmethod
    def make_random_password(length=10, allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'):
        return ''.join(secrets.choice(allowed_chars) for i in range(length))
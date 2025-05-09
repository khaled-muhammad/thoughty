from django.contrib.auth.models import AbstractUser
from django.db import models
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
from django.db import models

# Create your models here.

class Badge(models.Model):
    name           = models.CharField(max_length=100)
    description    = models.TextField()
    icon           = models.ImageField(upload_to='badges/')
    condition_code = models.TextField()
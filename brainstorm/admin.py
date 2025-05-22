from django.contrib import admin
from .models import Prompt, RouletteSpin, Variation
# Register your models here.

admin.site.register(Prompt)
admin.site.register(RouletteSpin)
admin.site.register(Variation)
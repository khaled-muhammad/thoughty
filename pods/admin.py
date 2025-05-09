from django.contrib import admin
from .models import Pod, PodStageHistory, Tag

# Register your models here.

admin.site.register(Pod)
admin.site.register(PodStageHistory)
admin.site.register(Tag)

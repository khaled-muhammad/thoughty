from django.contrib import admin
from .models import Badge, AchievementLog, TokenTransaction, TokenBalance
# Register your models here.

admin.site.register(Badge)
admin.site.register(AchievementLog)
admin.site.register(TokenTransaction)
admin.site.register(TokenBalance)

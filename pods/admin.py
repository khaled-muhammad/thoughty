from django.contrib import admin
from .models import Pod, PodStageHistory, Tag

class PodStageHistoryInline(admin.TabularInline):
    model = PodStageHistory
    extra = 0
    readonly_fields = ['version', 'content', 'created_at', 'timestamp']
    can_delete = False

@admin.register(Pod)
class PodAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'stage', 'version', 'is_public', 'created_at']
    list_filter = ['stage', 'is_public', 'created_at']
    search_fields = ['title', 'content', 'user__username']
    readonly_fields = ['version', 'created_at', 'timestamp']
    filter_horizontal = ['tags']
    inlines = [PodStageHistoryInline]

@admin.register(PodStageHistory)
class PodStageHistoryAdmin(admin.ModelAdmin):
    list_display = ['pod', 'version', 'created_at']
    list_filter = ['created_at']
    search_fields = ['pod__title', 'content']
    readonly_fields = ['created_at', 'timestamp']

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

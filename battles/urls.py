from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BattleViewSet, VoteCreateView

router = DefaultRouter()
router.register('battles', BattleViewSet, basename='battle')


urlpatterns = [
    path('', include(router.urls)),
    path('vote/', VoteCreateView.as_view(), name='vote'),
]

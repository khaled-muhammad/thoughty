from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PodViewSet

router = DefaultRouter()
router.register(r'pods', PodViewSet, basename='pod')

urlpatterns = [
    path('', include(router.urls)),
]
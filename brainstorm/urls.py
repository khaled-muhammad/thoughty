from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PromptViewSet, 
    spin_roulette, 
    VariationListCreateView, 
    VariationDetailView,
    create_pod_from_variation
)

router = DefaultRouter()
router.register(r'prompts', PromptViewSet, basename='prompt')

urlpatterns = [
    path('', include(router.urls)),
    path('roulette/spin/', spin_roulette, name='spin-roulette'),
    path('variations/', VariationListCreateView.as_view(), name='variation-list'),
    path('variations/<int:pk>/', VariationDetailView.as_view(), name='variation-detail'),
    path('pods/from-variation/', create_pod_from_variation, name='pod-from-variation'),
]
from django.urls import path
from .views import MentorProfileView, GenerateInsightsView, SuggestionView

urlpatterns = [
    path('profile/', MentorProfileView.as_view()),
    path('insights/', GenerateInsightsView.as_view()),
    path('suggestions/', SuggestionView.as_view()),
]

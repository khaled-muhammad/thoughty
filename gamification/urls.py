from django.urls import path
from .views import BadgeListView, LeaderboardView, TransactionListView

urlpatterns = [
    path('badges/', BadgeListView.as_view(), name='badge-list'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
] 
from django.urls import path
from .views import BadgeListView, LeaderboardView, TransactionListView, UserStatsView

urlpatterns = [
    path('badges/', BadgeListView.as_view(), name='badge-list'),
    path('stats/', UserStatsView.as_view(), name='user-stats'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
] 
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.custom_login, name='custom_login'),
    path('refresh/', views.refresh_token, name='refresh_token'),
    path('guest/', views.create_guest_user, name='create_guest_user'),
] 
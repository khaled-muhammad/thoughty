from django.urls import path
from . import views

urlpatterns = [
    path('contact/', views.contact_message_create, name='contact_message_create'),
    path('newsletter/subscribe/', views.newsletter_subscribe, name='newsletter_subscribe'),
    path('newsletter/unsubscribe/', views.newsletter_unsubscribe, name='newsletter_unsubscribe'),
] 
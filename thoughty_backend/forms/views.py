from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import ContactMessage, NewsletterSubscription
from .serializers import ContactMessageSerializer, NewsletterSubscriptionSerializer

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_message_create(request):
    """
    Create a new contact message
    """
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        contact_message = serializer.save()
        
        # Send email notification to admin (optional)
        try:
            send_mail(
                subject=f'New Contact Message: {contact_message.subject}',
                message=f'''
                New contact message received:
                
                Name: {contact_message.name}
                Email: {contact_message.email}
                Phone: {contact_message.phone or 'Not provided'}
                Subject: {contact_message.get_subject_display()}
                
                Message:
                {contact_message.message}
                ''',
                from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@thoughty.com',
                recipient_list=['admin@thoughty.com'],  # Replace with actual admin email
                fail_silently=True,
            )
        except Exception as e:
            # Log the error but don't fail the request
            print(f"Failed to send email notification: {e}")
        
        return Response({
            'message': 'Your message has been sent successfully! We will get back to you soon.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Please check your input and try again.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def newsletter_subscribe(request):
    """
    Subscribe to newsletter
    """
    serializer = NewsletterSubscriptionSerializer(data=request.data)
    if serializer.is_valid():
        # Check if email exists but is inactive, reactivate it
        existing = NewsletterSubscription.objects.filter(email=serializer.validated_data['email']).first()
        if existing:
            if not existing.is_active:
                existing.is_active = True
                existing.save()
                return Response({
                    'message': 'Welcome back! You have been resubscribed to our newsletter.',
                    'data': NewsletterSubscriptionSerializer(existing).data
                }, status=status.HTTP_200_OK)
        else:
            subscription = serializer.save()
            
            # Send welcome email (optional)
            try:
                send_mail(
                    subject='Welcome to Thoughty Newsletter!',
                    message=f'''
                    Hi there!
                    
                    Thank you for subscribing to the Thoughty newsletter. 
                    You'll now receive updates about new features, tips, and insights to help you develop your thoughts.
                    
                    Stay thoughtful!
                    The Thoughty Team
                    ''',
                    from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@thoughty.com',
                    recipient_list=[subscription.email],
                    fail_silently=True,
                )
            except Exception as e:
                # Log the error but don't fail the request
                print(f"Failed to send welcome email: {e}")
            
            return Response({
                'message': 'Thank you for subscribing! You will receive updates about new features and insights.',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
    
    return Response({
        'message': 'Please enter a valid email address.',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def newsletter_unsubscribe(request):
    """
    Unsubscribe from newsletter
    """
    email = request.data.get('email')
    if not email:
        return Response({
            'message': 'Email address is required.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    subscription = NewsletterSubscription.objects.filter(email=email.lower().strip()).first()
    if subscription and subscription.is_active:
        subscription.is_active = False
        subscription.save()
        return Response({
            'message': 'You have been successfully unsubscribed from our newsletter.'
        }, status=status.HTTP_200_OK)
    
    return Response({
        'message': 'Email address not found in our newsletter list.'
    }, status=status.HTTP_404_NOT_FOUND)

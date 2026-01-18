import random
from django.core.mail import send_mail
from .models import EmailOTP

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    send_mail(
        subject="Verify your email",
        message=f"Your OTP is: {otp}\nThis OTP is valid for 10 minutes.",
        from_email=None,
        recipient_list=[email],
        fail_silently=False,
    )

def create_and_send_otp(user):
    otp=generate_otp()
    EmailOTP.objects.create(user=user,otp=otp)
    send_otp_email(user.email, otp)

from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    name=models.CharField(max_length=100)
    email=models.EmailField(unique=True)
    phone_no=models.CharField(max_length=15, unique=True, null=True,blank=True,)
    timestamp=models.DateTimeField(auto_now_add=True)
    isAdmin=models.BooleanField(default=False)
    state=models.CharField(max_length=50)
    USERNAME_FIELD="email"
    REQUIRED_FIELDS=["username"]

class EmailOTP(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    otp=models.CharField(max_length=6)
    created_at=models.DateTimeField(auto_now_add=True)
    is_verified=models.BooleanField(default=False)
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.created_at + timezone.timedelta(minutes=10)

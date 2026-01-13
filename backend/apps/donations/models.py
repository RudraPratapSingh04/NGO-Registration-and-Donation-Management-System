from django.db import models
from django.conf import settings
User = settings.AUTH_USER_MODEL


# Create your models here.
class Donation(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    )
    user=models.ForeignKey(User,on_delete=models.PROTECT)
    initiated_at=models.DateTimeField(auto_now_add=True)
    completed_at=models.DateTimeField(null=True, blank=True)
    amount=models.DecimalField(max_digits=10, decimal_places=2)
    status=models.CharField(max_length=10, choices=STATUS_CHOICES)
    transaction_id=models.CharField(max_length=100, unique=True)

class Donor(models.Model):
    user=models.OneToOneField(User,on_delete=models.PROTECT)

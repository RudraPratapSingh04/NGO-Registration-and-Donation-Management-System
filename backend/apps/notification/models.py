from django.db import models
from apps.donations.models import Donation  
# Create your models here.
class Notification(models.Model):
    message=models.CharField(max_length=200)
    sent_at=models.DateTimeField(auto_now_add=True)
    donation=models.ForeignKey(Donation,on_delete=models.PROTECT)
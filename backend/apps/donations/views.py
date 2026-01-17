import uuid
import hashlib
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from rest_framework.response import Response
from .models import Donation
# Create your views here.
MERCHANT_ID = "YOUR_MERCHANT_ID"
MERCHANT_SECRET = "YOUR_MERCHANT_SECRET"
CURRENCY = "INR"
def generate_payhere_hash(order_id, amount):
    secret_hash = hashlib.md5(MERCHANT_SECRET.encode()).hexdigest().upper()
    raw_string = f"{MERCHANT_ID}{order_id}{amount}{CURRENCY}{secret_hash}"
    return hashlib.md5(raw_string.encode()).hexdigest().upper()

@api_view(["POST"])

def make_donation(request):

    amount=request.data.get('amount')
    if not amount or Decimal(amount) <= 0:
        return Response({"error": "Invalid amount"}, status=400)
    user=request.user
    order_id = f"DON_{uuid.uuid4().hex[:12]}"
    donation=Donation.objects.create(
        amount=Decimal(amount),
        user=user,
        status="PENDING",
        transaction_id=order_id,
    )
    user=request.user
    hash_value = generate_payhere_hash(order_id, amount)
    return Response({
        "order_id":order_id,
        "items":"Donation",
        "amount":str(amount),
        "currency":CURRENCY,
        "plan_id":"YOUR_PLAN_ID",
        "hash":hash_value,
        "first_name":user.name,
        "last_name":"",
        "email":user.email,
        "phone":user.phone_no,
        "city":"",
        "address":user.state,
    }, status=200)


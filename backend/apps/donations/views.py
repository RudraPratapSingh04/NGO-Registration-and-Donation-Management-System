import uuid
import hashlib
from django.http import HttpResponse
import hmac
from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.shortcuts import render
from rest_framework.response import Response

from .paypal_client import paypal_client
from .models import Donation
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone
# from paypalcheckoutsdk.orders import OrdersCreateRequest
from paypalcheckoutsdk.orders.orders_capture_request import OrdersCaptureRequest
from paypalcheckoutsdk.orders.orders_create_request import OrdersCreateRequest

# Create your views here.


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_donation(request):
    amount = request.data.get("amount")

    if not amount or Decimal(amount) <= 0:
        return Response({"error": "Invalid amount"}, status=400)

    donation = Donation.objects.create(
        user=request.user,
        amount=Decimal(amount),
        transaction_id=str(uuid.uuid4()),
        status="PENDING"
    )

    paypal_request = OrdersCreateRequest()
    paypal_request.prefer("return=representation")
    paypal_request.request_body({
        "intent": "CAPTURE",
        "purchase_units": [{
            "reference_id": donation.transaction_id,
            "amount": {
                "currency_code": "USD",
                "value": str(donation.amount)
            }
        }]
    })

    response = paypal_client().execute(paypal_request)

    return Response({
        "order_id": response.result.id
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def capture_donation(request, order_id):
    capture_request = OrdersCaptureRequest(order_id)
    response = paypal_client().execute(capture_request)

    donation = Donation.objects.filter(
        transaction_id=response.result.purchase_units[0].reference_id
    ).first()

    if donation:
        donation.status = "SUCCESS"
        donation.completed_at = timezone.now()
        donation.save()

    return Response({"status": "success"})

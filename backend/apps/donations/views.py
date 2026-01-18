from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from rest_framework.response import Response
from apps.donations.serializers import DonationSerializer
from .models import Donation
from rest_framework.views import APIView
from django.db.models import Sum, Count
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
from django.http import HttpResponse
from django.utils import timezone
import csv
from .models import Donation



stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    amount = request.data.get("amount")
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return Response({"error": "Invalid amount"}, status=400)
    if amount < 50:
        return Response({"error": "Minimum donation amount is ₹50"}, status=400)

    donation = Donation.objects.create(
        user=request.user,
        amount=amount,
        status="PENDING",
        transaction_id="TEMP"
    )

    intent = stripe.PaymentIntent.create(
        amount=int(amount * 100),  # paise
        currency="inr",
        automatic_payment_methods={"enabled": True},
        metadata={
            "donation_id": donation.id
        }
    )
    donation.transaction_id = intent.id
    donation.save(update_fields=["transaction_id"])
    return Response({
        "clientSecret": intent.client_secret
    })

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.headers.get("Stripe-Signature")
    try:
        event = stripe.Webhook.construct_event(
            payload,
            sig_header,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        return HttpResponse(status=400)
    intent = event["data"]["object"]
    donation_id = intent["metadata"].get("donation_id")
    if not donation_id:
        return HttpResponse(status=200)
    if event["type"] == "payment_intent.succeeded":
        Donation.objects.filter(id=donation_id).update(
            status="SUCCESS",
            completed_at=timezone.now()
        )
    elif event["type"] == "payment_intent.payment_failed":
        Donation.objects.filter(id=donation_id).update(
            status="FAILED",
            completed_at=timezone.now()
        )
    return HttpResponse(status=200)


class MyDonationsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        donations = Donation.objects.filter(user=request.user).order_by("-initiated_at")
        serializer = DonationSerializer(donations, many=True)
        total_amount = donations.filter(status="SUCCESS").aggregate(total=Sum("amount"))["total"] or 0
        counts = donations.values("status").annotate(count=Count("id"))
        counts_map = {c["status"]: c["count"] for c in counts}

        return Response({
            "donations": serializer.data,
            "summary": {
                "total": donations.count(),
                "success": donations.filter(status="SUCCESS").count(),
                "pending": donations.filter(status="PENDING").count(),
                "failed": donations.filter(status="FAILED").count(),
                "total_amount": total_amount,
            }
        })
    

def export_donations_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="donations_export.csv"'

    writer = csv.writer(response)
    writer.writerow(['User', 'Amount', 'Date Initiated', 'Date Completed', 'Status', 'Transaction ID'])
    donations = Donation.objects.select_related('user').all()

    for donation in donations:
        writer.writerow([
            donation.user.get_full_name() or donation.user.username,
            donation.amount,
            donation.initiated_at.strftime('%Y-%m-%d %H:%M'),
            donation.completed_at.strftime('%Y-%m-%d %H:%M') if donation.completed_at else 'N/A',
            donation.get_status_display(),
            donation.transaction_id,
        ])

    return response

def get_donations(request):
    donations = Donation.objects.select_related('user').all().order_by('-initiated_at')
    
    data = []
    for d in donations:
        data.append({
            "id": d.id,
            "user": d.user.get_full_name() or d.user.username,
            "amount": float(d.amount),
            "date": d.initiated_at.strftime('%b %d, %Y'),
            "status": d.get_status_display(), 
            "transaction_id": d.transaction_id
        })
    
    return JsonResponse(data, safe=False)
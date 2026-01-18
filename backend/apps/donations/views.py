from decimal import Decimal
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from rest_framework.response import Response
from apps.donations.serializers import DonationSerializer
from .models import Donation
from rest_framework.views import APIView
from django.db.models import Sum, Count
from django.contrib.auth import get_user_model
import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
from django.http import HttpResponse
from django.utils import timezone
import csv

User=get_user_model()

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
    
class AllDonationsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        donations = Donation.objects.order_by("-initiated_at")
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
class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_users = User.objects.count()

        successful_donations = Donation.objects.filter(status="SUCCESS")

        total_successful_donations = successful_donations.count()

        total_donor_users = (
            successful_donations
            .values("user")
            .distinct()
            .count()
        )

        return Response({
            "total_registered_users": total_users,
            "total_donor_users": total_donor_users,
            "total_successful_donations": total_successful_donations,
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def admin_dashboard(request):
    # 🔐 Admin-only access
    if not request.user.isAdmin:
        return Response(
            {"detail": "You are not authorized to view this page"},
            status=403
        )

    # ===== USERS =====
    total_users = User.objects.count()

    # ===== DONATIONS =====
    successful_donations = Donation.objects.filter(status="SUCCESS")
    total_donation_amount = (
        successful_donations.aggregate(total=Sum("amount"))["total"] or 0
    )

    status_counts = (
        Donation.objects
        .values("status")
        .annotate(count=Count("id"))
    )
    status_map = {s["status"]: s["count"] for s in status_counts}

    successful = status_map.get("SUCCESS", 0)
    pending = status_map.get("PENDING", 0)
    failed = status_map.get("FAILED", 0)

    # ===== RECENT DONATIONS =====
    recent_donations = (
        Donation.objects
        .select_related("user")
        .order_by("-initiated_at")[:5]
    )

    recent_data = [
        {
            "name": d.user.name,
            "date": d.initiated_at,
            "amount": d.amount,
            "status": d.status,
        }
        for d in recent_donations
    ]

    # ✅ ALWAYS RETURN RESPONSE
    return Response({
        "stats": {
            "total_users": total_users,
            "total_donations": total_donation_amount,
            "successful": successful,
            "failed": failed,
        },
        "recent_donations": recent_data,
        "donation_chart": {
            "successful": successful,
            "pending": pending,
            "failed": failed,
        },
    })
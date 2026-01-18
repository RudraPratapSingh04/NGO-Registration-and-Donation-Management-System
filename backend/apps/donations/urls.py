from django.urls import path
from . import views

urlpatterns = [
    path("api/my/", views.MyDonationsView.as_view()),
    path("api/create-payment-intent/", views.create_payment_intent),
    path("api/stripe/webhook/", views.stripe_webhook),
    path("api/all/", views.AllDonationsView.as_view()),
    path("api/admin/stats/", views.AdminStatsView.as_view()),
]


from django.urls import path
from . import views
from .views import export_donations_csv
from .views import get_donations

urlpatterns = [
    path("api/my/", views.MyDonationsView.as_view()),
    path("api/create-payment-intent/", views.create_payment_intent),
    path("api/stripe/webhook/", views.stripe_webhook),
    path("api/admin/dashboard/", views.admin_dashboard),
    path("api/all/", views.AllDonationsView.as_view()),
    path("api/admin/stats/", views.AdminStatsView.as_view()),
    path('api/export-csv/', export_donations_csv, name='export_donations_csv'),
    path('api/donations/', get_donations)
]

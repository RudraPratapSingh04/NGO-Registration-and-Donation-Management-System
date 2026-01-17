from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            "id",
            "transaction_id",
            "amount",
            "status",
            "initiated_at",
            "completed_at",
        ]

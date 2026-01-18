from rest_framework import serializers
from .models import Donation

class DonationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True)
    class Meta:
        model = Donation
        fields = [
            "id",
            "transaction_id",
            "amount",
            "status",
            "initiated_at",
            "completed_at",
            "user_name"
        ]

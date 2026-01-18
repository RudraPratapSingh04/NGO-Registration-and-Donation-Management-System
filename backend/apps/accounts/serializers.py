from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field="email"
    
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": getattr(user, "name", None),
            "is_admin": user.is_staff,
            "state": getattr(user, "state", None),
            "phone": getattr(user, "phone_no", None),
            "created_at": user.date_joined,
            "profile_picture": user.profile_picture.url if user.profile_picture else None,
        }
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,min_length=8)
    class Meta:
        model=User
        fields=["name","email","password","phone_no","state"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        email = validated_data.pop("email")
        user = User(
            email=email,
            username=email,                  
            **validated_data
        )
        user.set_password(password)
        user.save()
        return user
        
class OTPVerifySerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField(max_length=6)

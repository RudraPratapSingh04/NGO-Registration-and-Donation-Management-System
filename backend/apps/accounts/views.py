from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from .serializers import UserSerializer
from apps.accounts.utils import create_and_send_otp
from apps.accounts.models import EmailOTP
from .serializers import EmailTokenObtainPairSerializer, OTPVerifySerializer, RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser

User = get_user_model()


class LoginView(TokenObtainPairView):
    permission_classes=[AllowAny]
    serializer_class=EmailTokenObtainPairSerializer
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh = response.data.get("refresh")
        if refresh:
            response.set_cookie(
                key="refresh",
                value=refresh,
                httponly=True,
                secure=False, 
                samesite="Lax",
                path="/api/auth/refresh/",
            )
            del response.data["refresh"]
        return response
    
class RegisterView(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            user.is_active = False
            create_and_send_otp(user)
            return Response(
                {"message": "OTP sent to email"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class VerifyOTPView(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        email=request.data.get("email")
        otp=request.data.get("otp")
        try:
            user=User.objects.get(email=email)
            record=EmailOTP.objects.filter(
                user=user,
                otp=otp,
                is_verified=False
            ).latest("created_at")
        except (User.DoesNotExist, EmailOTP.DoesNotExist):
            return Response({"error": "Invalid OTP"}, status=400)
        if record.is_expired():
            return Response({"error": "OTP expired"}, status=400)
        user.is_active = True
        user.save()
        record.is_verified = True
        record.save()
        refresh=RefreshToken.for_user(user)
        response=Response({
            "access":str(refresh.access_token),
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.isAdmin,  
                "state": getattr(user, "state", None),
                "phone": getattr(user, "phone_no", None),
                "created_at": user.date_joined,
                "profile_picture": user.profile_picture.url if user.profile_picture else None,
            }
        })
        response.set_cookie(
            key="refresh",
            value=str(refresh),
            httponly=True,
            secure=False,  
            samesite="Lax",
            path="/api/auth/refresh/",
        )
        return response


class RefreshTokenView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"detail": "No refresh token"}, status=401)
        refresh = RefreshToken(refresh_token)
        access = str(refresh.access_token)
        return Response({"access": access})
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.isAdmin,  
            "state": getattr(user, "state", None),
            "phone": getattr(user, "phone_no", None),
            "created_at": user.date_joined,
            "profile_picture": user.profile_picture.url if user.profile_picture else None,
        })
    
class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        response = Response({"detail": "Logged out"})
        response.delete_cookie("refresh")  
        return response
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile_picture(request):
    user = request.user
    image = request.FILES.get("profile_picture")

    if not image:
        return Response({"error": "No image provided"}, status=400)

    user.profile_picture = image
    user.save()

    return Response({
        "profile_picture": user.profile_picture.url
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_users(request):
    user=request.user
    if not user.isAdmin:
        return Response({"error":"Only admins can access this."},status=403)
    users = User.objects.all().order_by("-timestamp")
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def toggle_admin(request, user_id):
    user=request.user
    if not user.isAdmin:
        return Response({"error":"Only admins can access this."},status=403)    
    try:
        user = User.objects.get(id=user_id)
        user.isAdmin = not user.isAdmin
        user.save()
        return Response({
            "id": user.id,
            "isAdmin": user.isAdmin
        })
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

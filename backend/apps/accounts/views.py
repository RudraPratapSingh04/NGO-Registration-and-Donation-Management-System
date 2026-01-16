from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from .serializers import EmailTokenObtainPairSerializer


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
            "is_admin": user.is_staff,  
            "state": getattr(user, "state", None),
            "phone": getattr(user, "phone", None),
            "created_at": user.date_joined,
        })
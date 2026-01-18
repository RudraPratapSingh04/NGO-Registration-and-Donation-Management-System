from django.urls import path
from .views import update_profile_picture

urlpatterns = [
    path("api/profile/upload-picture/", update_profile_picture),
]

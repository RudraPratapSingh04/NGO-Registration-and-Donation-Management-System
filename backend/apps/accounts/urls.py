from django.urls import path
from .views import update_profile_picture
from .views import list_users
from .views import toggle_admin, list_users

urlpatterns = [
    path("api/profile/upload-picture/", update_profile_picture),
    path("users/", list_users),
    path("users/<int:user_id>/toggle-admin/", toggle_admin),
]

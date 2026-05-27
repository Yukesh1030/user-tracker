from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    BlogViewSet,
    TrackActivityView,
    AnalyticsDashboardView
)

router = DefaultRouter()
router.register(r'blogs', BlogViewSet, basename='blog')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('track/', TrackActivityView.as_view(), name='track_activity'),
    path('analytics/', AnalyticsDashboardView.as_view(), name='analytics_dashboard'),
    path('', include(router.urls)),
]

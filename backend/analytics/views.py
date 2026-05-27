from django.shortcuts import render
from django.utils import timezone
from datetime import timedelta
from django.db.models import Avg, Count, Sum
from django.contrib.auth import get_user_model
import urllib.request
import json

# State mappings for Indian States
STATE_MAP = {
    'Tamil Nadu': 'TN',
    'Andhra Pradesh': 'AP',
    'Telangana': 'TS',
    'Karnataka': 'KA',
    'Kerala': 'KL',
    'Maharashtra': 'MH',
    'Delhi': 'DL',
    'Uttar Pradesh': 'UP',
    'Gujarat': 'GJ',
    'West Bengal': 'WB',
    'Rajasthan': 'RJ',
    'Madhya Pradesh': 'MP',
    'Bihar': 'BR',
    'Punjab': 'PB',
    'Haryana': 'HR',
    'Odisha': 'OD',
    'Assam': 'AS',
    'Goa': 'GA',
}

def get_location_display(lat, lng):
    if lat is None or lng is None:
        return "Blocked"
    url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lng}&format=json&accept-language=en"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'UserTrackerSystem/1.0 (contact: admin@tracker.com)'}
    )
    try:
        with urllib.request.urlopen(req, timeout=3) as response:
            res_data = json.loads(response.read().decode())
            address = res_data.get('address', {})
            
            # Extract city/town/village/county/suburb
            district = (
                address.get('city') or 
                address.get('town') or 
                address.get('village') or 
                address.get('county') or 
                address.get('suburb') or 
                'Unknown District'
            )
            
            if district.endswith(' District'):
                district = district[:-9]
                
            state = address.get('state', '')
            state_display = STATE_MAP.get(state, state)
            
            country_code = address.get('country_code', '').upper()
            if country_code == 'IN':
                country_display = 'IND'
            else:
                country_display = country_code or 'Unknown'
                
            return f"{district}, {state_display}, {country_display}"
    except Exception as e:
        print(f"Error reverse geocoding {lat},{lng}: {e}")
        return f"{lat:.4f}, {lng:.4f}"

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Blog, UserActivity
from .serializers import UserRegisterSerializer, BlogSerializer, UserActivitySerializer

User = get_user_model()

# Custom permission to check if user has admin role
class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'

# Custom JWT login endpoint to return user metadata
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['id'] = self.user.id
        data['username'] = self.user.username
        data['email'] = self.user.email
        data['role'] = self.user.role
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = CustomTokenObtainPairSerializer

# User Registration View
class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "role": user.role
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Blog post views
class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer

    def get_permissions(self):
        # Anyone authenticated can read blogs, but only admins can write/delete
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminUserRole()]

# Track activity view
class TrackActivityView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        data = request.data.copy()
        
        # Look up and set the location display name
        lat = data.get('latitude')
        lng = data.get('longitude')
        data['location_display'] = get_location_display(lat, lng)
        
        serializer = UserActivitySerializer(data=data)
        if serializer.is_valid():
            # Automatically associate the logged-in user
            serializer.save(user=request.user)
            return Response({"message": "Activity tracked successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Analytics Dashboard View (Admin Only)
class AnalyticsDashboardView(APIView):
    permission_classes = (IsAdminUserRole,)

    def get(self, request):
        # 1. Total users
        total_users = User.objects.count()

        # 2. Online/Active users (users with activity in the last 5 minutes)
        five_minutes_ago = timezone.now() - timedelta(minutes=5)
        active_users = UserActivity.objects.filter(
            timestamp__gte=five_minutes_ago
        ).values('user').distinct().count()

        # 3. Average session duration
        avg_session = UserActivity.objects.aggregate(Avg('session_duration'))['session_duration__avg'] or 0
        avg_session_rounded = round(avg_session, 1)

        # 4. Most active user
        most_active_user_query = UserActivity.objects.values('user__username').annotate(
            total_duration=Sum('session_duration')
        ).order_by('-total_duration').first()
        most_active_user = most_active_user_query['user__username'] if most_active_user_query else "N/A"

        # 5. Page visit distributions for Recharts
        page_visits = list(
            UserActivity.objects.values('current_page')
            .annotate(views=Count('id'))
            .order_by('-views')
        )

        # Rename keys slightly to be more chart-friendly if needed
        # (e.g. current_page -> page, views -> views)
        chart_data = [
            {"page": item['current_page'], "views": item['views']}
            for item in page_visits
        ]

        # 6. Activities over time (grouped by hour or just recent activities count)
        # For simplicity, let's group user visits by page and list recent trend
        # Let's get the 10 most recent activities locations
        locations_query = UserActivity.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False
        ).select_related('user').order_by('-timestamp')[:50]
        
        locations = []
        # Group by unique user to show their latest location
        seen_users = set()
        for act in locations_query:
            if act.user and act.user.id not in seen_users:
                seen_users.add(act.user.id)
                locations.append({
                    "username": act.user.username,
                    "latitude": act.latitude,
                    "longitude": act.longitude,
                    "page": act.current_page,
                    "timestamp": act.timestamp.isoformat()
                })

        # 7. Raw Activity Logs for table
        activities = UserActivity.objects.select_related('user').order_by('-timestamp')[:100]
        logs = []
        for act in activities:
            logs.append({
                "id": act.id,
                "username": act.user.username if act.user else "Anonymous",
                "page": act.current_page,
                "duration": act.session_duration,
                "latitude": act.latitude,
                "longitude": act.longitude,
                "location": act.location_display or ("Blocked" if act.latitude is None else f"{act.latitude:.4f}, {act.longitude:.4f}"),
                "timestamp": act.timestamp.isoformat()
            })

        return Response({
            "metrics": {
                "total_users": total_users,
                "active_users": active_users,
                "avg_session_duration": avg_session_rounded,
                "most_active_user": most_active_user
            },
            "page_visits": chart_data,
            "locations": locations,
            "logs": logs
        }, status=status.HTTP_200_OK)

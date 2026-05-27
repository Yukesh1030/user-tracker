from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Blog, UserActivity

User = get_user_model()

class UserAuthTests(APITestCase):
    def test_user_registration(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword123',
            'role': 'normal'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')
        self.assertEqual(User.objects.get().role, 'normal')

    def test_user_login(self):
        # Setup user
        user = User.objects.create_user(
            username='loginuser',
            email='loginuser@example.com',
            password='loginpassword123',
            role='normal'
        )
        url = reverse('login')
        data = {
            'username': 'loginuser',
            'password': 'loginpassword123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check JWT tokens exist
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        # Check custom metadata is returned
        self.assertEqual(response.data['username'], 'loginuser')
        self.assertEqual(response.data['role'], 'normal')


class BlogTests(APITestCase):
    def setUp(self):
        self.normal_user = User.objects.create_user(
            username='normaluser',
            email='normaluser@example.com',
            password='password123',
            role='normal'
        )
        self.admin_user = User.objects.create_superuser(
            username='adminuser',
            email='adminuser@example.com',
            password='password123',
            role='admin'
        )
        self.blog = Blog.objects.create(
            title='Test Blog Title',
            content='Test Blog Content'
        )

    def test_list_blogs_unauthenticated_fails(self):
        url = reverse('blog-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_blogs_authenticated_succeeds(self):
        url = reverse('blog-list')
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_blog_normal_user_fails(self):
        url = reverse('blog-list')
        self.client.force_authenticate(user=self.normal_user)
        data = {'title': 'New Blog', 'content': 'Content'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_blog_admin_user_succeeds(self):
        url = reverse('blog-list')
        self.client.force_authenticate(user=self.admin_user)
        data = {'title': 'New Blog', 'content': 'Content'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Blog.objects.count(), 2)


class TrackingAndAnalyticsTests(APITestCase):
    def setUp(self):
        self.normal_user = User.objects.create_user(
            username='normaluser',
            email='normaluser@example.com',
            password='password123',
            role='normal'
        )
        self.admin_user = User.objects.create_superuser(
            username='adminuser',
            email='adminuser@example.com',
            password='password123',
            role='admin'
        )
        self.track_url = reverse('track_activity')
        self.analytics_url = reverse('analytics_dashboard')

    def test_tracking_unauthenticated_fails(self):
        data = {
            'current_page': '/blogs',
            'latitude': 37.7749,
            'longitude': -122.4194,
            'session_duration': 15
        }
        response = self.client.post(self.track_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tracking_authenticated_succeeds(self):
        self.client.force_authenticate(user=self.normal_user)
        data = {
            'current_page': '/blogs',
            'latitude': 37.7749,
            'longitude': -122.4194,
            'session_duration': 15
        }
        response = self.client.post(self.track_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserActivity.objects.count(), 1)
        
        activity = UserActivity.objects.get()
        self.assertEqual(activity.user, self.normal_user)
        self.assertEqual(activity.current_page, '/blogs')
        self.assertEqual(activity.latitude, 37.7749)
        self.assertEqual(activity.session_duration, 15)

    def test_analytics_dashboard_normal_user_fails(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(self.analytics_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_analytics_dashboard_admin_user_succeeds(self):
        # Create some activities to aggregate
        UserActivity.objects.create(
            user=self.normal_user,
            current_page='/blogs',
            latitude=10.0,
            longitude=20.0,
            session_duration=30
        )
        UserActivity.objects.create(
            user=self.normal_user,
            current_page='/blogs/1',
            latitude=10.0,
            longitude=20.0,
            session_duration=60
        )

        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.analytics_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify structure
        self.assertIn('metrics', response.data)
        self.assertIn('page_visits', response.data)
        self.assertIn('locations', response.data)
        self.assertIn('logs', response.data)
        
        # Verify aggregations
        metrics = response.data['metrics']
        self.assertEqual(metrics['total_users'], 2)  # normal_user + admin_user
        self.assertEqual(metrics['active_users'], 1)  # normal_user has recent activity
        self.assertEqual(metrics['avg_session_duration'], 45.0)  # (30 + 60) / 2
        self.assertEqual(metrics['most_active_user'], 'normaluser')

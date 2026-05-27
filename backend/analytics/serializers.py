from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Blog, UserActivity

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data.get('role', 'normal')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')

class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ('id', 'title', 'content', 'created_at')

class UserActivitySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserActivity
        fields = ('id', 'user', 'current_page', 'latitude', 'longitude', 'session_duration', 'timestamp')

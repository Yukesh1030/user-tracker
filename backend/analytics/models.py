from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('normal', 'Normal'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='normal')

    def __str__(self):
        return f"{self.username} ({self.role})"

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class UserActivity(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='activities', null=True, blank=True)
    current_page = models.CharField(max_length=255)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    session_duration = models.IntegerField(help_text="Duration spent on page in seconds")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        username = self.user.username if self.user else "Anonymous"
        return f"{username} visited {self.current_page} for {self.session_duration}s at {self.timestamp}"

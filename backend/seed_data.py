import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tracker_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from analytics.models import Blog

User = get_user_model()

def seed():
    print("--- Seeding Database ---")
    
    # 1. Create admin user
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@tracker.com',
            password='adminpassword123',
            role='admin'
        )
        print("Created Admin user:")
        print("  Username: admin")
        print("  Password: adminpassword123")
    else:
        # Update role to admin if it exists
        admin = User.objects.get(username='admin')
        admin.role = 'admin'
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
        print("Admin user 'admin' already exists (updated role to admin).")

    # 2. Create normal user
    if not User.objects.filter(username='normal').exists():
        normal = User.objects.create_user(
            username='normal',
            email='user@tracker.com',
            password='normalpassword123',
            role='normal'
        )
        print("Created Normal user:")
        print("  Username: normal")
        print("  Password: normalpassword123")
    else:
        print("Normal user 'normal' already exists.")

    # 3. Create mock blog contents
    blogs = [
        {
            "title": "Getting Started with React JS",
            "content": "React JS is a popular JavaScript library developed by Facebook for building dynamic and interactive user interfaces, primarily single-page applications. In this article, we cover components, state management, props, and why React is the developer's choice for frontend development in 2026."
        },
        {
            "title": "Django REST Framework: Clean APIs Made Simple",
            "content": "Django REST Framework (DRF) is a powerful and flexible toolkit for building Web APIs. With built-in serializers, routers, viewsets, and support for token-based authentication (JWT), Django makes it incredibly fast and safe to implement secure endpoints for modern web applications."
        },
        {
            "title": "Why Real-Time Analytics is Changing the Web",
            "content": "Understanding how your visitors browse your site, where they drop off, and where they access your services from is vital for conversions. In this blog, we explore the tech behind analytics tracking, geo-location capabilities, Leaflet visualizations, and why session duration data is so important."
        },
        {
            "title": "Designing Harmonious UI Themes",
            "content": "Aesthetic matters. In web applications, color harmony, typography, interactive micro-animations, and subtle shadows can turn a basic tool into a premium experience. In this guide, we dive into Vanilla CSS layouts, glassmorphism design parameters, and modern styling tokens."
        }
    ]

    for b_data in blogs:
        blog, created = Blog.objects.get_or_create(
            title=b_data["title"], 
            defaults={"content": b_data["content"]}
        )
        if created:
            print(f"Created Blog: '{blog.title}'")
        else:
            print(f"Blog '{blog.title}' already exists.")
            
    print("--- Seeding Completed successfully ---")

if __name__ == '__main__':
    seed()

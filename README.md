# 📊 User Tracker & Analytics Platform

A full-stack **User Tracking & Analytics Platform** built with **Django REST Framework and ReactJS** for monitoring user activity, analyzing engagement, managing blog content, and providing secure role-based access.

The application includes **JWT authentication, real-time activity tracking, admin analytics, location-based visualization, blog management, REST APIs, and responsive dashboards**.

---

## 🚀 Overview

The User Tracker & Analytics Platform allows administrators to monitor how users interact with the application while providing authenticated users with access to protected content.

The system tracks activities such as:

- Page navigation
- Session duration
- User location
- Page visits
- Activity timestamps
- User engagement

Administrators can access an analytics dashboard containing key metrics and manage blog content through role-based permissions.

---

## ✨ Features

### 🔐 Authentication & Authorization

- User registration and login
- JWT-based authentication
- Access token refresh
- Protected routes
- Role-based access control
- Admin and normal user roles
- Secure API communication

### 👤 User Activity Tracking

The platform records user activity including:

- Current page
- Page navigation
- Session duration
- Latitude
- Longitude
- Activity timestamp
- User information

### 📈 Admin Analytics Dashboard

Administrators can monitor:

- Total registered users
- Active users
- Average session duration
- Most active user
- Page visit statistics
- User activity trends
- Location-based activity

### 📝 Blog Management

Authenticated users can:

- View blog posts
- Read individual blog posts

Administrators can:

- Create blog posts
- Update blog posts
- Delete blog posts
- Manage published content

### 🗺️ Location Visualization

- Browser-based geolocation
- Latitude and longitude tracking
- Interactive maps
- Location markers
- Leaflet-based visualization

### 📱 Responsive UI

- Responsive layouts
- Mobile-friendly design
- Reusable React components
- Dashboard interfaces
- Responsive navigation
- Interactive charts

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| ReactJS | Frontend application |
| Vite | Development & build tool |
| React Router | Client-side routing |
| Axios | API communication |
| Recharts | Analytics visualization |
| Leaflet | Interactive maps |
| React Leaflet | React map integration |
| Lucide React | UI icons |
| CSS | Styling |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Django | Web framework |
| Django REST Framework | REST API development |
| Simple JWT | JWT authentication |
| Django CORS Headers | Cross-origin communication |
| PostgreSQL | Production database |
| SQLite | Local development fallback |

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      ReactJS UI      │
                    │                      │
                    │  User Dashboard      │
                    │  Admin Dashboard      │
                    │  Blog Interface      │
                    └──────────┬───────────┘
                               │
                               │ Axios / REST API
                               ▼
                    ┌──────────────────────┐
                    │    Django REST API   │
                    │                      │
                    │ Authentication       │
                    │ User Management      │
                    │ Activity Tracking    │
                    │ Blog Management      │
                    │ Analytics            │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Database        │
                    │                      │
                    │ PostgreSQL / SQLite  │
                    └──────────────────────┘

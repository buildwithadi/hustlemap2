from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.landing, name='landing'),
    path('home/', views.home, name='home'),
    path('join-waitlist/', views.join_waitlist, name='join_waitlist'),
    path('generate-roadmap/', views.generate_roadmap, name='generate_roadmap'),
] 
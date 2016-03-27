"""
durbanbudget URL Configuration
"""
from django.conf.urls import url, include
from rest_framework import routers
from django.contrib import admin

router = routers.DefaultRouter()

urlpatterns = [
    url(r'^', include('webapp.urls')),
    url(r'^', include(router.urls)),
    url(r'^api/budget/', include('budget.urls')),
    url(r'^admin/', admin.site.urls),
]

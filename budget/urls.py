from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    url(r'^$', views.budget_root),
    url(r'^sections/$', views.SectionList.as_view(), name='section-list'),
    url(r'^years/$', views.YearList.as_view(), name='year-list'),
    url(r'^sections/(?P<pk>[0-9]+)/$', views.SectionDetail.as_view(), name='section-detail'),
    url(r'^subsections/(?P<pk>[0-9]+)/$', views.SubSectionDetail.as_view(), name='subsection-detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

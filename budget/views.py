from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import filters

from .models import Section, SubSection
from .serializers import SectionSerializer, SectionDetailSerializer, SubSectionSerializer

@api_view(['GET'])
def budget_root(request, format=None):
    return Response({
        'sections': reverse('section-index', request=request, format=format)
    })

class SectionList(generics.ListAPIView):
    queryset = Section.objects.order_by('order').all()
    serializer_class = SectionSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('year', 'order',)

class SectionDetail(generics.RetrieveAPIView):
    queryset = Section.objects.order_by('order').all()
    serializer_class = SectionDetailSerializer

class SubSectionDetail(generics.RetrieveAPIView):
    queryset = SubSection.objects.order_by('order').all()
    serializer_class = SubSectionSerializer

from rest_framework import serializers
from .models import Section, SubSection

class SubSectionSerializer(serializers.HyperlinkedModelSerializer):
    link = serializers.HyperlinkedIdentityField(view_name='subsection-detail', read_only=True)
    class Meta:
        model = SubSection
        fields = ('id', 'title', 'order', 'revenue', 'expenditure', 'section', 'link')

class SectionSerializer(serializers.HyperlinkedModelSerializer):
    link = serializers.HyperlinkedIdentityField(view_name='section-detail', read_only=True)
    class Meta:
        model = Section
        fields = ('id', 'title', 'order', 'year', 'revenue', 'expenditure', 'link')

class SectionDetailSerializer(serializers.HyperlinkedModelSerializer):
    link = serializers.HyperlinkedIdentityField(view_name='section-detail', read_only=True)
    sub_sections = SubSectionSerializer(many=True, read_only=True)
    class Meta:
        model = Section
        fields = ('id', 'title', 'order', 'year', 'revenue', 'expenditure', 'sub_sections', 'link')

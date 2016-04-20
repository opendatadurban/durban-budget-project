from django.db import models
from .section import Section

class SubSection(models.Model):
    title = models.CharField(max_length=200)
    order = models.IntegerField(db_index=True)
    revenue = models.FloatField(default=0)
    expenditure = models.FloatField(default=0)
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='sub_sections')

    def __str__(self):
        return '%i - %s' % (self.order, self.title)

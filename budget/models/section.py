from django.db import models

class Section(models.Model):
    title = models.CharField(max_length=200)
    order = models.IntegerField(db_index=True)
    year = models.CharField(max_length=20, db_index=True)

    subsections_cache = None

    def __str__(self):
        return '%i - %s' % (self.order, self.title)

    @property
    def revenue(self):
        return Section.objects.filter(pk=self.pk).aggregate(revenue=models.Sum('sub_sections__revenue'))['revenue']

    @property
    def expenditure(self):
        return Section.objects.filter(pk=self.pk).aggregate(expenditure=models.Sum('sub_sections__expenditure'))['expenditure']

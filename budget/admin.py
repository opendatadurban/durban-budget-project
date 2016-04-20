import csv
import re
from django.contrib import admin
from django.conf.urls import url
from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils.encoding import force_text
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.db import transaction
from .models import Section, SubSection

csrf_protect_m = method_decorator(csrf_protect)

IS_POPUP_VAR = '_popup'
TO_FIELD_VAR = '_to_field'


class SubSectionInline(admin.TabularInline):
    model = SubSection
    extra = 1


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    inlines = [
        SubSectionInline
    ]

    def get_urls(self):
        urls = super(self.__class__, self).get_urls()
        my_urls = [
            url(r'^bulk_add/$',
                self.admin_site.admin_view(self.bulk_add),
                name="budget_section_bulk_add")
        ]
        return my_urls + urls

    def upsert_section(self, title, order, year):
        try:
            section = Section.objects.get(order=order, year=year)
            section.title = title
        except Section.DoesNotExist:
            section = Section(title=title, order=order, year=year)

        section.save()

    def upsert_sub_section(self, year, section_order, title, order, revenue, expenditure):
        section = Section.objects.get(order=section_order, year=year)

        try:
            sub_section = SubSection.objects.get(
                order=order, section_id=section.pk)
            sub_section.title = title
        except SubSection.DoesNotExist:
            sub_section = SubSection(title=title, order=order)

        sub_section.section = section
        if revenue is not None:
            sub_section.revenue = revenue

        if expenditure is not None:
            sub_section.expenditure = expenditure

        sub_section.save()

    @csrf_protect_m
    @transaction.atomic
    def bulk_add(self, request):
        opts = self.model._meta
        app_label = opts.app_label
        if not self.has_change_permission(request, None):
            raise PermissionDenied

        context = dict(
            self.admin_site.each_context(request),
            opts=opts,
            add=True,
            change=False,
            is_popup=(IS_POPUP_VAR in request.POST or
                      IS_POPUP_VAR in request.GET),
            module_name=force_text(opts.verbose_name_plural),
            has_add_permission=self.has_add_permission(request),
            has_change_permission=self.has_change_permission(request, None),
            has_delete_permission=self.has_delete_permission(request, None),
            save_as=self.save_as,
            save_on_top=self.save_on_top,
        )

        if request.method == 'POST':
            title_regex = re.compile(r"Vote ([\d]*) -(.*)", re.IGNORECASE)
            sub_title_regex = re.compile(
                r"([\d]*)\.([\d]*)(.*)", re.IGNORECASE)
            csv_string = request.FILES.get(
                'bulk_csv').read().decode().split('\n')
            is_expenditure = True
            read_header = False
            years = []
            for row in csv.reader(csv_string):
                if len(row) == 0:
                    continue
                if not read_header:
                    read_header = True
                    for year in row[1:]:
                        years.append(year)
                    continue

                if row[0] == 'Expenditure':
                    is_expenditure = True
                    continue
                elif row[0] == 'Revenue':
                    is_expenditure = False
                    continue

                title_match = title_regex.match(row[0])
                if title_match is not None:
                    for year in years:
                        self.upsert_section(title_match.groups()[1].replace("-", "").strip(),
                                            int(title_match.groups()[0]),
                                            year)
                else:
                    s = sub_title_regex.match(row[0])
                    for i in range(len(years)):
                        year = years[i]
                        amount = row[i + 1]
                        if amount is None or amount == '':
                            amount = 0

                        revenue = None
                        expenditure = None
                        if is_expenditure:
                            expenditure = int(amount)
                        else:
                            revenue = int(amount)

                        self.upsert_sub_section(year,
                                                int(s.groups()[0]),
                                                s.groups()[2].replace(
                                                    "-", "").strip(),
                                                int(s.groups()[1]),
                                                revenue,
                                                expenditure)
            return HttpResponseRedirect(reverse('admin:%s_%s_changelist' %
                                                (opts.app_label, opts.model_name),
                                                current_app=self.admin_site.name))

        return TemplateResponse(request, "admin/budget/bulk_add.html", context)

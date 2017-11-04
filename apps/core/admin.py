# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from apps.core.models import Record

class RecordAdmin(admin.ModelAdmin):
    list_display = ("message", "place", "ipaddr", "datetime")
    readonly_fields = list_display

admin.site.register(Record, RecordAdmin)
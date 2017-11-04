# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from apps.core.models import Record

class RecordAdmin(admin.ModelAdmin):
    list_display = ("message", "place", "datetime")

admin.site.register(Record, RecordAdmin)
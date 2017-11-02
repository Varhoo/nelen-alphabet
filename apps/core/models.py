# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


class Record(models.Model):
    place = models.CharField(max_length=64)
    message = models.CharField(max_length=64)
    datetime = models.DateTimeField(auto_created=True)

    def __unicode__(self):
        return "%s" % self.message
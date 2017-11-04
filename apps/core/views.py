# -*- coding: utf-8 -*-
 #from __future__ import unicode_literals

from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core import serializers
from apps.core.models import Record

def home(request):
    return render(request, 'index.html', {})

def sync(request, place):
    msg = Record.objects.filter(place=place).order_by("-datetime").first()
    return render(request, 'index.html', {"msg": msg})

# send PUT: {msg: message}
# receive  {id: id}
@api_view(['GET', 'PUT'])
def record(request, place=None, format=None):
    content = {'status': 0, }
    if place and request.method == 'PUT':
        msg = Record(place=place, message=request.data["msg"])
        msg.save()
        content['status'] = msg.id
    elif place and request.method == 'GET':
        last_id = int(request.GET.get("id"))
        msg = Record.objects.filter(place=place, id__gt=last_id).order_by("-datetime").first()
        content['msq']=serializers.serialize("json", [msg,])
    return Response(content)

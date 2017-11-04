# -*- coding: utf-8 -*-
 #from __future__ import unicode_literals

from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.core import serializers
from apps.core.models import Record
from django.views.decorators.csrf import csrf_exempt


def home(request):
    return render(request, 'index.html', {})

def sync(request, place):
    msg = Record.objects.filter(place=place).order_by("-datetime").first()
    return render(request, 'index.html', {"msg": msg, "place": place})

# send PUT: {msg: message}
# receive  {id: id}
@api_view(['GET', 'PUT'])
def record(request, place=None, format=None):
    content = {'status': 0, }
    if request.method == 'PUT':
        msg = Record(place=place, message=request.data["msg"])
        msg.save()
        content['status'] = msg.id
    elif place and request.method == 'GET':
        last_id = request.GET.get("id")
        if last_id:
            msg = Record.objects.filter(place=place, id__gt=int(last_id)).order_by("-datetime").first()
        else:
            msg = Record.objects.filter(place=place).first()
        if msg:
            content['msg']=serializers.serialize("json", [msg,])
        else:
            content['msg'] = {}
    return Response(content)

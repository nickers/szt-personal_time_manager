from django.db import models
from django.contrib.auth.models import User
from piston.handler import BaseHandler
from piston.utils import rc
from draft.models import *
from base_models import AuthBaseHandler

# filters
class AuthProject():
    def __init__(self, u):
        self.objects = Project.objects.filter(user=u.id)
        self.exclude = ('id','user')
    def get(self, filter=None):
        res = self.objects
        which = {}
        if filter:
            for w in ["id","slug","user__id"]:
                if w in filter:
                    which[w] = filter[w]
            res = res.filter(**which)
        return res

class AuthNote():
    def __init__(self, u):
        self.objects = Note.objects.filter(project__user=u.id)
        self.exclude = ('id','user')
    def get(self, filter=None):
        res = self.objects
        which = {}
        if filter and "project" in filter:
            res = res.filter(project__slug=filter["project"])
        return res.order_by("-add_time")

class AuthTimeEvent():
    def __init__(self, u):
        self.objects = TimeEvent.objects.filter(project__user=u.id)
        self.exclude = ('id','user')
    def get(self, filter=None):
        return self.objects

# handlers
class AuthProjectHandler(AuthBaseHandler):
    allowed_methods = ('GET', 'DELETE', 'PUT', 'POST')
    model = Project
    model_filter = AuthProject
    fields = ('id', 'name', 'slug', 'start_date', ('parent_project', ('id','name','slug')), 'planned_work', 'budget', 'description', ('user',('id','username')))
    
    def pre_create(self, request, *args, **kwargs):
        try:
            request.data['user'] = request.user
        except Exception as e:
            print e
            
    def delete(self, request, **kwargs):
        if len(kwargs)==0:
            return rc.BAD_REQUEST
        return super(AuthProjectHandler,self).delete(request, kwargs)


class AuthNoteHandler(AuthBaseHandler):
    model = Note
    allowed_methods = ('GET', 'DELETE', 'POST')
    model_filter = AuthNote
    fields = ('id', 'name', 'description', ('files', ('id','file')), ('project', ('id', 'name')), 'add_time')
    
    def pre_create(self, request, *args, **kwargs):
        try:
            request.data['project_id'] = Project.objects.filter(user=request.user).get(slug=kwargs['project']).id
        except Exception as e:
            print e

class AuthTimeEventHandler(AuthBaseHandler):
    model = TimeEvent
    model_filter = AuthTimeEvent
    fields = (('project',('id','name','slug')), 'start_time', 'end_time', 'comments')
    

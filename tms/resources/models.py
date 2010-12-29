from django.db import models
from django.contrib.auth.models import User
from piston.handler import BaseHandler
from piston.utils import rc
from draft.models import *

# filters
class AuthProject():
    def __init__(self, u):
        self.objects = Project.objects.filter(user=u.id)
        self.exclude = ('id','user')
    def get(self):
        return self.objects

class AuthNote():
    def __init__(self, u):
        self.objects = Note.objects.filter(project__user=u.id)
        self.exclude = ('id','user')
    def get(self):
        return self.objects

# handlers
class AuthProjectHandler(BaseHandler):
    allowed_methods = ('GET', 'DELETE', 'PUT', 'POST')
    model = Project
    model_filter = AuthProject
    fields = ('name', 'slug', 'start_date', 'parent_project', 'planned_work', 'budget', 'description', ('user',('id','username')))
    
    def create(self, request, *args, **kwargs):
        request.POST['user'] = request.user.id
        return BaseHandler.create(self, request, *args, **kwargs)
    
    def read(self, request, id=None):
        """
        Returns object with given id ("404 Not found" if no object with given id)
        or list of objects. Both are filtered only for logged user.
        """
        base = self.model_filter(request.user).get()
        
        if id:
            try:
                return base.get(pk=id)
            except:
                return rc.NOT_FOUND
        else:
            return base.all()
        
    def delete(self, request, id):
        base = self.model_filter(request.user).get()
        base.filter(pk=id).delete()
        return rc.DELETED
    
    def update(self, request, id):
        base = self.model_filter(request.user).get()
        data = request.POST
        for fld in self.model_filter.exclude:
            del data[fld]

        obj = None
        try:
            obj = base.get(id)
        except:
            obj = self.model()
        
        fields = [x[0].name for x in obj._meta.get_fields_with_model()]
        
        
            
        

class AuthNoteHandler(AuthProjectHandler):
    model = Note
    model_filter = AuthNote
    fields = ('id', 'name', 'description', ('files', ('id','file')), ('project', ('id', 'name')), 'add_time')

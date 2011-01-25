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
    def get(self):
        return self.objects

class AuthNote():
    def __init__(self, u):
        self.objects = Note.objects.filter(project__user=u.id)
        self.exclude = ('id','user')
    def get(self):
        return self.objects

# handlers
class AuthProjectHandler(AuthBaseHandler):
    allowed_methods = ('GET', 'DELETE', 'PUT', 'POST')
    model = Project
    model_filter = AuthProject
    fields = ('name', 'slug', 'start_date', ('parent_project', ('id','name','slug')), 'planned_work', 'budget', 'description', ('user',('id','username')))
    
    def pre_create(self, request, *args, **kwargs):
        request.POST['user'] = request.user.id

    def xpost_read(self, request, id, results):
	print results
	res = []
	for proj in results:
		print proj
		if proj.parent_project != None:
			par_id = proj.parent_project.id
			proj.parent_project = None
			#print dir(proj)
			#proj = proj.__dict__
			#print proj
		res.append(proj);
	return res

class AuthNoteHandler(AuthBaseHandler):
    model = Note
    model_filter = AuthNote
    fields = ('id', 'name', 'description', ('files', ('id','file')), ('project', ('id', 'name')), 'add_time')

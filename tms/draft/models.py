from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

#
# project = {id:int, parent_project:int, name:string, slug:slug, desc:text, budget:int, start_date:timestamp, planned:work_time}
# note = {id:int, name:string, desc:text, files:[], project_id:int, add_date:timestamp}
# work_time = {id:int, project_id:int, start_time:timestamp, end_time:timestamp, comment:text}
# event:work_time = {}
# time_event = work_time

class Project(models.Model):
    user = models.ForeignKey(User)
    parent_project = models.ForeignKey('self', null=True, blank=True)
    name = models.CharField(max_length=250)
    slug = models.SlugField()
    description = models.TextField(blank=True)
    budget = models.IntegerField()
    start_date = models.DateTimeField()
    planned_work = models.TimeField(default=None, null=True, blank=True)
    
    def __unicode__(self):
        return "#%d \"%s\"[%s]"%(self.id,self.name,self.slug)

class UploadedFile(models.Model):
    file = models.FileField(upload_to=settings.DRAFT_UPLOADED_FILES_DIR)
    
    def __unicode__(self):
        return "UploadedFile: \"%s\""%(self.file)

class Note(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    files = models.ManyToManyField(UploadedFile, null=False)
    project = models.ForeignKey(Project)
    add_time = models.DateTimeField(auto_now_add=True)


CHOICE_EVENT_TIME_TYPE = (
    ('WRK', 'Work'),
    ('MET', 'Meeting')
)

class TimeEvent(models.Model):
    project = models.ForeignKey(Project)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    comments = models.TextField(blank=True)
    
    def __unicode__(self):
        return "Event: %s - %s [%s]"%(self.start_time,self.end_time,self.project)
    

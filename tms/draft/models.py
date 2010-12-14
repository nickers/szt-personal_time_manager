from django.db import models
from django.conf import settings

#
# project = {id:int, parent_project:int, name:string, slug:slug, desc:text, budget:int, start_date:timestamp, planned:work_time}
# note = {id:int, name:string, desc:text, files:[], project_id:int, add_date:timestamp}
# work_time = {id:int, project_id:int, start_time:timestamp, end_time:timestamp, comment:text}
# event:work_time = {}
# time_event = work_time

class Project(models.Model):
    parent_project = models.ForeignKey('self')
    name = models.CharField(max_length=250)
    slug = models.SlugField()
    description = models.TextField()
    budget = models.IntegerField(default=0)
    start_date = models.DateTimeField(default=0)
    planned_work = models.TimeField(default=0)

class UploadedFile(models.Model):
    file = models.FileField(upload_to=settings.DRAFT_UPLOADED_FILES_DIR)

class Note(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField()
    files = models.ManyToManyField(UploadedFile)
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
    comments = models.TextField()    
    

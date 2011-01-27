from django.http import HttpResponse
from models import *
import simplejson as json
import datetime

def bilans(request, project):
    r = {}
    proj = Project.objects.filter(user=request.user).get(slug=project)
    r['name'] = proj.name
    r['budget'] = proj.budget
    r['description'] = proj.description
    r['top_level'] = (proj.parent_project==None)
    r['subprojects'] = Project.objects.filter(parent_project=proj).count()
    
    # delta time
    td = datetime.datetime.now()
    td = td - td
    
    events = TimeEvent.objects.filter(project=proj)
    for e in events:
        td = td + e.end_time-e.start_time
    r['used_time'] = round(((td.microseconds + (td.seconds + td.days * 24 * 3600) * 10**6) / 10**6)/3600.0, 2)
    
    # dodaj podzadania
    events = TimeEvent.objects.filter(project__parent_project=proj) 
    for e in events:
        td = td + e.end_time-e.start_time
    r['used_time_whole'] = round(((td.microseconds + (td.seconds + td.days * 24 * 3600) * 10**6) / 10**6)/3600.0, 2)
    
    r['used_time_percent'] = '-'
    r['used_time_whole_percent'] = '-'
    if (proj.budget>0):
        r['used_time_percent'] = str(round(r['used_time']*100.0/proj.budget, 2)) + '%'
        r['used_time_whole_percent'] = str(round(r['used_time_whole']*100.0/proj.budget, 2)) + '%'
    
    
    
    return HttpResponse(json.dumps(r))
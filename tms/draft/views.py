from django.http import HttpResponse
from django.conf import settings
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
    prev_m = td
    act_m = td
    
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

def upload_file(request, project):
    print project
    if request.method == 'POST':
        form = UploadedFileForm(request.POST, request.FILES)
        if form.is_valid():
            fname = handle_uploaded_file(request.FILES['file'], project)
            uf = UploadedFile();
            uf.file = fname
            uf.save();
            
            note = Note()
            note.project = Project.objects.get(slug=project)
            print note.project
            note.name = request.FILES['file'].name
            note.description = "Rozmiar: " + str(round(request.FILES['file'].size/(1024.0*1024.0),5)) + "MB"
            note.save()
            note.files.add(uf)
            note.save()
            return HttpResponse("OK")
        else:
            print form.errors
            return HttpResponse("INVALID")
    else:
        return HttpResponse("FAILED")
#        form = UploadFileForm()
#    return render_to_response('upload.html', {'form': form})
#    return HttpResponse("OK")


def handle_uploaded_file(f,project):
    from hashlib import sha1
    from random import choice
    fname = sha1(project).hexdigest()+"-"
    for i in range(10):
        fname = fname + choice("qwertyuiopasdfghjklzxcvbnm-")
    fname = fname+"-"+f.name
    destination = open(settings.DRAFT_UPLOADED_FILES_DIR+"/"+fname, 'wb+')
    for chunk in f.chunks():
        destination.write(chunk)
    destination.close()
    return fname

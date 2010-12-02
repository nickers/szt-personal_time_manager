from django.db import models

#
# project = {id:int, parent_project:int, name:string, slug:slug, desc:text, budget:int, start_date:timestamp, planned:work_time}
# note = {id:int, name:string, desc:text, files:[], project_id:int, add_date:timestamp}
# work_time = {id:int, project_id:int, start_time:timestamp, end_time:timestamp, comment:text}
# event:work_time = {}
#

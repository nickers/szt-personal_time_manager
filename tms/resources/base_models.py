from piston.handler import BaseHandler
from piston.utils import rc


# handlers
class AuthBaseHandler(BaseHandler):
    allowed_methods = ('GET', 'DELETE', 'PUT', 'POST')
    model = None # Model
    model_filter = None # AuthProject # filter
    fields = ('name', 'slug', 'start_date', 'parent_project', 'planned_work', 'budget', 'description', ('user',('id','username')))

    def pre_create(self, request, *args, **kwargs):
        """ Empty pre-create action. Overrite to modify data before create is called. """
        None
        
    def pre_read(self, request, id):
        None
        
    def post_read(self, request, id, results):
        return results


    def create(self, request, *args, **kwargs):
        self.pre_create(request, *args, **kwargs)
        return super(self).create(self, request, *args, **kwargs)
    
    def read(self, request, id=None):
        """
        Returns object with given id ("404 Not found" if no object with given id)
        or list of objects. Both are filtered only for logged user.
        """
        base = self.model_filter(request.user).get()
        
        self.pre_read(request, id)
        
        if id:
            try:
                return self.post_read(request, id, base.get(pk=id))
            except:
                return rc.NOT_FOUND
        else:
            return self.post_read(request, id, base.all())

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

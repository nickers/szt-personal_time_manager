qx.Class.define( "tms.NotesData", {
  extend : qx.core.Object,
  members : {
    fetchNotes : function(proj_slug,func) {
      var rc = new tms.RuntimeConfig();
      var dd = new tms.DataDownloader();
      var ctx = this;
      dd.fetchData(rc.getUrl("notes") + proj_slug.toString(), function(e) {
        ctx.model = e;
        ctx.fireDataEvent("changeNotes", e);
        if (func) func(e);
      },{});
    },
    
    addNote : function(proj_slug,name,desc,func) {
      var rc = new tms.RuntimeConfig();
      var dd = new tms.DataDownloader();
      var ctx = this;
      dd.postData(rc.getUrl("notes") + proj_slug.toString(), 
        function(e) { if(func)func(e); ctx.fetchNotes(proj_slug); },
        {name:name, description:desc},
        {});
    }
  },
  properties : {
    notes : {
      nullable : true,
      event : "changeNotes"
    }
  }
});

qx.Class.define( "tms.ProjectsData", {
  extend : qx.core.Object,
  members : {
    fetchProjects : function() {
      var rc = new tms.RuntimeConfig();
      var dd = new tms.DataDownloader();
      var ctx = this;
      dd.fetchData(rc.getUrl("projects"), function(e) {
        ctx.model = e;
        ctx.fireDataEvent("changeProjects", e);
      },{});
    },
    
    addProject : function(parent,data,func) {
      var rc = new tms.RuntimeConfig();
      var dd = new tms.DataDownloader();
      var ctx = this;
      if (!parent) parent='';
      console.log("new project for: " + rc.getUrl("projects") + parent.toString());
      dd.postData(rc.getUrl("projects") + parent.toString(), 
        function(e) { if(func)func(e); ctx.fetchProjects(); },
        data,
        {});
    }
  },
  properties : {
    projects : {
      nullable : true,
      event : "changeProjects"
    }
  }
});

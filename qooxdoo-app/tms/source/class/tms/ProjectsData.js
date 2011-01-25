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
    }
  },
  properties : {
    projects : {
      nullable : true,
      event : "changeProjects"
    }
  }
});

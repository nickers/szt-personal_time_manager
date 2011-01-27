qx.Class.define( "tms.EventsData", {
  extend : qx.core.Object,
  members : {
    fetchEvents : function(proj_slug,func) {
      var rc = new tms.RuntimeConfig();
      var dd = new tms.DataDownloader();
      var ctx = this;
      dd.fetchData(rc.getUrl("events") + proj_slug.toString(), function(e) {
        ctx.model = e;
        ctx.fireDataEvent("changeEvents", e);
        if (func) func(e);
      },{});
    },
    
    addEvent : function(proj_slug,data,func) {
      var rc = new tms.RuntimeConfig();
      var dd = new tms.DataDownloader();
      var ctx = this;
      dd.postData(rc.getUrl("events") + proj_slug.toString(), 
        function(e) { if(func)func(e); ctx.fetchEvents(proj_slug); },
        data,
        {});
    }
  },
  
  properties : {
    notes : {
      nullable : true,
      event : "changeEvents"
    }
  }
});

qx.Class.define( "tms.RuntimeConfig", {
  extend : qx.core.Object,
  members : {
    getUrl : function(name) {
      var base_url = "/resources";
      var urls = {
        "projects" : "/project/",
        "notes" : "/note/",
        "events" : "/event/"
      };
      return base_url + urls[name];
    }
  }
});

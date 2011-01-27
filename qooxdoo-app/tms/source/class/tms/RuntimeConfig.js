qx.Class.define( "tms.RuntimeConfig", {
  extend : qx.core.Object,
  members : {
    getUrl : function(name) {
      var base_url = "/resources";
      var urls = {
        "projects" : base_url + "/project/",
        "notes" : base_url + "/note/",
        "events" : base_url + "/event/",
        "stats" : "/draft/bilans/"
      };
      return urls[name];
    }
  }
});

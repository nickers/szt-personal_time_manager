qx.Class.define( "tms.NotesData", {
  extend : qx.core.Object,
  members : {
    fetchNotes : function(projId) {
      var rc = new tms.RuntimeConfig();
      var dd = new tms.DataDownloader();
      var ctx = this;
      dd.fetchData(rc.getUrl("notes") + projId.toString(), function(e) {
        ctx.model = e;
        ctx.fireDataEvent("changeNotes", e);
      },{});
    }
  },
  properties : {
    notes : {
      nullable : true,
      event : "changeNotes"
    }
  }
});

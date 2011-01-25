/**
* Using advAJAX download JSON data and pass it to callback function. 
 */
qx.Class.define( "tms.DataDownloader", {
  extend : qx.core.Object,
  members : {
    fetchData : function(url, callback, params) {
      if (!params) params = {};
      if (typeof(advAJAX)=="undefined") {
        this.ensureLoaded(url,callback,params);
      } else {
        advAJAX.get({
          url: url, 
          onSuccess: function(r) { var j=eval(r.responseText); callback(j); }
        });
      }
    },
    ensureLoaded : function(url, callback, params) {
      var l = new qx.io.ScriptLoader();
      l.load("/static/advajax.js", function(e) {
        this.fetchData(url,callback,params);
      }, this);
    }
  }
});

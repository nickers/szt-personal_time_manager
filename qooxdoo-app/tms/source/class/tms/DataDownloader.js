/**
* Using advAJAX download JSON data and pass it to callback function. 
 */
qx.Class.define( "tms.DataDownloader", {
  extend : qx.core.Object,
  members : {
    fetchData : function(url, callback, params) {
      if (!params) params = {};

      if (typeof(advAJAX)=="undefined") {
        this.ensureLoaded(function() {this.fetchData(url,callback,params);} );
      } else {
        advAJAX.get({
          url: url, 
          onSuccess: function(r) { var j=JSON.parse(r.responseText); callback(j); }
        });
      }
    },
    
    postData : function(url, callback, data, params) {
      if (!params) params = {};
      if (typeof(advAJAX)=="undefined") {
        this.ensureLoaded(function() {this.postData(url,callback,data,params);} );
      } else {
        data = JSON.stringify(data);
        advAJAX.post({
          url: url,
          raw_data : data.toString(),
          onSuccess: function(r) { if (callback) callback(r.reponseText); }
        });
      }
    }
    ,
    ensureLoaded : function(f) {
      var l = new qx.io.ScriptLoader();
      l.load("/static/advajax.js?pseduo="+(new Date().getTime()), f, this);
    }
  }
});

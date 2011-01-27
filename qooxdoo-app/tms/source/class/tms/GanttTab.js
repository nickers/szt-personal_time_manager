qx.Class.define("tms.GanttTab",
{
  extend : qx.ui.tabview.Page,

  construct : function() {
    this.base(arguments, "Gantt", "icon/notes_tab.png");
    this.setLayout(new qx.ui.layout.Grow());
    this.setEmpty();
    this.notes_data = new tms.NotesData();
    this.notes_pane = null;
    this.setData();
  },
  
  members : {
    __init : function(proj_slug) {
      
      this.removeAll();
      
      var scr = new qx.ui.container.Scroll();
      this.add(scr);
      var g = new qx.ui.container.Composite();
      g.setLayout(new qx.ui.layout.Grow());
      g.add(new qx.ui.embed.Html('<div style="overflow:scroll;width:100%;height:100%;border:1px solid #0c0;"><div id="ganttChart" style="overflow:auto;border:1px solid #c00;"></div><div id="eventMessage"></div></div>'));
     
      
      g.addListener("resize", function() {
        $("#ganttChart").width('98%');
      },
      this);
      g.addListener("appear", function() {
        $("#ganttChart").width('98%');
        $("#ganttChart").height('auto');
      },
      this);
      scr.add(g);
      return g;

    },
    
    __prepare_data : function (data) {
            var d = {};
            data.forEach(function(o){
              if (!(o.project.id in d)) {
                d[o.project.id] = {id:o.project.id, name:o.project.name, series: [{name:"", time: [] }]}
              }
              d[o.project.id].series[0].time.unshift({start:Date.parse(o.start_time), end:Date.parse(o.end_time)});
            });
            
            var r = [];
            for (var i in d) {
              var o = d[i];
              r.unshift(o);
            };
            return r;
    },
    
    setProject : function(proj_slug) {
      this.setEmpty();
      if (proj_slug) {
        var ctx = this;
        this.displayGantt(proj_slug);
       }
    },
    
    setEmpty : function() {
      $("#ganttChart").empty();
    },
    
    setData : function(proj_slug) {
      var group = this.__init(proj_slug);
    },
    
    displayGantt : function(slug) {
      var ctx = this;
      var gd = new tms.EventsData();
      $("#ganttChart").innerHTML = "Trwa generowanie...";
      gd.fetchEvents(slug, function(e){
        var d = ctx.__prepare_data(e);
        $("#ganttChart").innerHTML = "";
        if (e.length>0) {
          showGantt(d);
        }
      });
      $("#ganttChart").width('98%');
    }
  }
});


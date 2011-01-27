qx.Class.define("tms.StatsTab",
{
  extend : qx.ui.tabview.Page,

  construct : function() {
    this.base(arguments, "Podsumowanie", "icon/notes_tab.png");
    this.setLayout(new qx.ui.layout.Grow());
    this.panel = this.__init();
    this.setEmpty();
  },
  
  members : {
    __init : function() {
      this.removeAll();
      
      var scr = new qx.ui.container.Scroll();
      this.add(scr);
      
      var group = new qx.ui.groupbox.GroupBox("Podsumowanie");
      scr.add(group);
      group.setLayout(new qx.ui.layout.VBox());
      
      return group;
    },
    
    setProject : function(proj_slug) {
      if (proj_slug) {
        var flds = [
          ["name", "Nazwa:", false],
          ["description", "Opis:", false],
          ["top_level", "Typ:", false],
          ["subprojects", "Ilość zadań:", true],
          ["budget", "Określony budżet czasu(godz.):", false],
          ["used_time", "Przepracowany czas(godz.):", false],
          ["used_time_percent", "Wykorzystanie budżetu:", false],
          ["used_time_whole", "Przepracowany czas łącznie z zadaniami(godz.):", true],
          ["used_time_whole_percent", "Wykorzystanie budżetu łącznie z zadaniami:", true]
        ];
        var rc = new tms.RuntimeConfig();
        var dd = new tms.DataDownloader();
        var ctx = this;
        dd.fetchData(rc.getUrl("stats") + proj_slug.toString(), function(e) {
          ctx.setEmpty();
          
          for (var i=0; i<flds.length; i++) {
            if (!e['top_level'] && flds[i][2])
              continue;
            
            var grp = new qx.ui.container.Composite();
            grp.setLayout(new qx.ui.layout.HBox(5)); 
            ctx.panel.add(grp); 
             
            var l = new qx.ui.basic.Label('<b>'+flds[i][1]+'</b>').set({rich:true, width:300});
            grp.add(l);
            
            var r = new qx.ui.basic.Label(e[flds[i][0]].toString());
            if (flds[i][0]=='top_level') {
              r.setValue((e['top_level'] ? "Projekt" : "Zadanie"));
            }
            grp.add(r);
          }
          //var l = new qx.ui.basic.Label();
        },{});
       } else {
         this.setEmpty();
       }
    },
    
    setEmpty : function() {
      this.panel.removeAll();
    }
  }
});
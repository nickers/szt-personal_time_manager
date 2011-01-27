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
    __init_notes : function(proj_slug) {
      
      /*if (this.notes_pane) {
        this.notes_pane.removeAll();
        this.add_btn.removeListenerById(this.add_listener);
        this.add_listener = this.add_btn.addListener("execute", function(e) {
          if (this.n_name.getValue()=="" || this.n_name.getValue()==null) {
            alert("Nazwa notatki jest obowiązkowa.");
          } else {
            this.notes_data.addNote(proj_slug,this.n_name.getValue(),this.n_desc.getValue());
          }
        }, this);
        
        if (proj_slug) this.add_btn.show();
        else this.add_btn.hide();
        
        return this.notes_pane;
      }*/
      
      this.removeAll();
      
      var scr = new qx.ui.container.Scroll();
      this.add(scr);
      var g = new qx.ui.container.Composite();
      g.setLayout(new qx.ui.layout.Grow());
      g.add(new qx.ui.embed.Html('<div style="overflow:scroll;width:100%;height:100%;border:1px solid #0c0;"><div id="ganttChart" style="overflow:auto;border:1px solid #c00;"></div><div id="eventMessage"></div></div>'));
      
      var appear_listener = null;
      appear_listener = g.addListener("appear", function() {
        g.removeListenerById(appear_listener);
        showGantt();
        //alert($("#ganttChart").height());
        //$("#ganttChart").hide();
        $("#ganttChart").width('98%');
        //alert(g.getHeight() + " // " + scr.getHeight() + "x" + scr.getWidth());
        
      },
      this);
      
      g.addListener("resize", function() {
        $("#ganttChart").width('98%');
      },
      this);
      scr.add(g);
      return g;
      
      var group = new qx.ui.groupbox.GroupBox("Gantt");
      scr.add(group);
      group.setLayout(new qx.ui.layout.VBox());
      
      
      //var btns = new qx.ui.groupbox.GroupBox("");
      /*
      var btns = new qx.ui.groupbox.GroupBox("");
      btns.setLayout(new qx.ui.layout.HBox());
      btns.add(new qx.ui.form.Button("Usuń"));
      */
      var btns = new qx.ui.container.Composite();
      btns.setLayout(new qx.ui.layout.HBox());
      var add_btn = new qx.ui.form.Button("Dodaj");
      btns.add(add_btn);
      //group.add(btns);
      
      var add_form = new qx.ui.groupbox.GroupBox("Dodaj notatkę");
      add_form.setLayout(new qx.ui.layout.VBox());
      add_form.add(new qx.ui.basic.Label("Nazwa notatki:"));
      var n_name = new qx.ui.form.TextField();
      add_form.add(n_name);
      add_form.add(new qx.ui.basic.Label("Opis:"));
      var n_desc = new qx.ui.form.TextArea();
      add_form.add(n_desc);
      add_form.add(btns);
      group.add(add_form);
      
      this.add_btn = add_btn; this.n_desc=n_desc; this.n_name=n_name;
      if (proj_slug) this.add_btn.show();
      else this.add_btn.hide();
      
      this.add_listener = add_btn.addListener("execute", function(e) {
        if (n_name.getValue()=="" || n_name.getValue()==null) {
          alert("Nazwa notatki jest obowiązkowa.");
        } else {
          this.notes_data.addNote(proj_slug,n_name.getValue(),""+n_desc.getValue());
        }
      }, this);
      
      var notes = new qx.ui.groupbox.GroupBox("");
      notes.setLayout(new qx.ui.layout.VBox());
      group.add(notes);
      
      this.notes_pane = notes;
      return notes;
    },
    
    setProject : function(proj_slug) {
      if (proj_slug) {
        var ctx = this;
        this.notes_data.fetchNotes(proj_slug, function(e) { /*ctx.setData(e, proj_slug);*/ } );
        this.notes_data.addListener("changeNotes", function(e) {
            ctx.setData(e.getData(), proj_slug);
          } )
       } else {
         this.setEmpty();
       }
    },
    
    setEmpty : function() {
      var group = this.__init_notes(null);
      group.setLayout(new qx.ui.layout.Canvas());
    },
    
    setData : function(notes, proj_slug) {
      var group = this.__init_notes(proj_slug);
      group.setLayout(new qx.ui.layout.Grow());
      
      var _html = '<div id="ganttChart"></div><br/><br/><div id="eventMessage"></div>'
        +   '<script type="text/javascript">'
//        +   '    $(function () { '
        +   '    function showGantt() { '
        +   '      $("#ganttChart").ganttView({ ' 
        +   '        data: ganttData, '
        +   '        slideWidth: 900, '
        +   '        behavior: { '
        +   '          draggable: false  , '
        +   '          onClick: function (data) { ' 
        +   '            var msg = "You clicked on an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }"; '
        +   '            $("#eventMessage").text(msg); '
        +   '          }, '
        +   '          onResize: function (data) { ' 
        +   '            var msg = "You resized an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }"; '
        +   '            $("#eventMessage").text(msg); '
        +   '          }, '
        +   '          onDrag: function (data) { ' 
        +   '            var msg = "You dragged an event: { start: " + data.start.toString("M/d/yyyy") + ", end: " + data.end.toString("M/d/yyyy") + " }"; '
        +   '            $("#eventMessage").text(msg); '
        +   '          } '
        +   '        } '
        +   '      }); '
        +   '      '
        +   '    }; '
        +   '  </script> <input type="button" onclick="showGantt();" value="Pokaż wykres"/>';
      
//      group.add(new qx.ui.embed.Html(_html));
      /*
      for (var noteNr=0; noteNr<notes.length; noteNr++) {
        var pola = {"name":"Nazwa", "description":"Notatka", "add_time":"Czas dodania"};
        var note = notes[noteNr];
        
        var noteGroup = new qx.ui.groupbox.GroupBox(note["name"]);
        noteGroup.setLayout(new qx.ui.layout.VBox());
        for (var itm in pola) {
          var txt = "<b>" + pola[itm] + ":</b> " + note[itm];
          noteGroup.add(new qx.ui.basic.Label(txt).set({rich:true}));
        }
        group.add(noteGroup);
      }
      */
    }
  }
});
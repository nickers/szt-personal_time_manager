qx.Class.define("tms.NotesTab",
{
  extend : qx.ui.tabview.Page,

  construct : function() {
    this.base(arguments, "Notatki", "icon/notes_tab.png");
    this.setLayout(new qx.ui.layout.Grow());
    this.setEmpty();
    this.notes_data = new tms.NotesData();
    this.notes_pane = null;
  },
  
  members : {
    __init_notes : function(proj_slug) {
      
      if (this.notes_pane) {
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
      }
      
      this.removeAll();
      
      var scr = new qx.ui.container.Scroll();
      this.add(scr);
      
      var group = new qx.ui.groupbox.GroupBox("Notatki");
      scr.add(group);
      group.setLayout(new qx.ui.layout.VBox());
      
      var up_file = new qx.ui.groupbox.GroupBox("Dodaj plik");
      this.up_file = up_file;
      up_file.setLayout(new qx.ui.layout.Grow());
      group.add(up_file);
      if (proj_slug){
        var _h = '<form method="post" action="/draft/file/'+proj_slug+'" enctype="multipart/form-data" ' 
               + " onsubmit=\"return AIM.submit(this, {'onStart' : startCallback, 'onComplete' : completeCallback})\""
               + '><input type="file" name="file" /><input type="submit" value="ok" />'
               + '</form>';
  
        var html = new qx.ui.embed.Html(_h);
        up_file.add(html);
      }
      
      
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
      
      this.up_file.removeAll();
      if (proj_slug) {
        var _h = '<form method="post" action="/draft/file/'+proj_slug+'" enctype="multipart/form-data" ' 
                 + " onsubmit=\"return AIM.submit(this, {'onStart' : startCallback, 'onComplete' : completeCallback})\""
                 + '><input type="file" name="file" /><input type="submit" value="ok" />'
                 + '</form>';
    
        var html = new qx.ui.embed.Html(_h);
        this.up_file.add(html);
      }
      
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
    }
  }
});
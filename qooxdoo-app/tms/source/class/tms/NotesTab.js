qx.Class.define("tms.NotesTab",
{
  extend : qx.ui.tabview.Page,

  construct : function() {
    this.base(arguments, "Notatki", "icon/notes_tab.png");
    this.setLayout(new qx.ui.layout.Grow());
    this.setEmpty();
  },
  
  members : {
    setEmpty : function() {
      this.removeAll();
      var group = new qx.ui.groupbox.GroupBox("Pusto...");
      group.setLayout(new qx.ui.layout.Canvas());
      this.add(group);
    },
    setData : function(notes) {
      this.removeAll();
      var group = new qx.ui.groupbox.GroupBox("Notatki");
      group.setLayout(new qx.ui.layout.VBox());
      var scr = new qx.ui.container.Scroll();
      scr.add(group);
      this.add(scr);
      
      for (var noteNr in notes) {
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
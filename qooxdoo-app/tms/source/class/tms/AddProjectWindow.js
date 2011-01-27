qx.Class.define("tms.AddProjectWindow",
{
  extend : qx.ui.window.Window,
  construct : function(pd,parent_project)
  {
    this.base(arguments, "Dodaj")
    this.setShowClose(false);
    this.setShowMaximize(false);
    this.setShowMinimize(false);
    this.setWidth(250);
    this.setHeight(250);
    this.moveTo(300,20);
    this.setLayout(new qx.ui.layout.VBox());
    
    
    var n_name = new qx.ui.form.TextField();
    var n_desc = new qx.ui.form.TextArea();
    var n_budget = new qx.ui.form.Spinner(0,0,1000000);
    var n_start = new qx.ui.form.DateField();    
    var b_ok = new qx.ui.form.Button("Dodaj");
    var b_cancel = new qx.ui.form.Button("Anuluj");
    
    n_start.setValue(new Date());
    n_start.setDateFormat(new qx.util.format.DateFormat("yyy-MM-dd HH:mm"));
    
    this.add(new qx.ui.basic.Label("Nazwa:"));
    this.add(n_name);
    this.add(new qx.ui.basic.Label("Opis:"));
    this.add(n_desc);
    this.add(new qx.ui.basic.Label("Budżet czasu(w godzinach):"));
    this.add(n_budget);
    this.add(new qx.ui.basic.Label("Start projektu:"));
    this.add(n_start);
    
    var btns = new qx.ui.container.Composite();
    btns.setLayout(new qx.ui.layout.Grid(1,2));
    btns.add(b_ok, {row:0,column:0});
    btns.add(b_cancel, {row:0,column:1});
    this.add(btns);
    
    b_cancel.addListener("execute", function() {
      this.close();      
    },
    this);
    
    b_ok.addListener("execute", function() {
      
      if (!n_name.getValue() || trim(n_name.getValue().toString())=="") {
        alert("Podaj nazwę.");
        return;
      }
      
      // znacznik czasu
      var data = new Date();
      var rok = data.getFullYear();
      var mies = data.getMonth()+1;
      var dzien = data.getDate();
      var godz = data.getHours();
      var min = data.getMinutes();
      var sec = data.getSeconds();
       
      // Dodanie zera na początku minut i sekund jeżeli trzeba
      if (godz < 10) godz = '0' + godz;
      if (min < 10) min = '0' + min;
      if (sec < 10) sec = '0' + sec;
      if (mies< 10) mies = '0' + mies;
      if (dzien< 10) dzien = '0' + dzien;
       
      // Utworzenie odpowiednio sformatowanej daty i czasu
      var data_i_czas = rok + '-' + mies + '-' + dzien + ' ' + godz + ':' + min + ':' + sec;
      
      
      var data = {
        name:trim(n_name.getValue()),
        description:n_desc.getValue() || "",
        parent_project:parent_project,
        budget:n_budget.getValue(),
        start_date:data_i_czas
      };
      var ctx = this;
      pd.addProject(parent_project, data, function(){ctx.close();});      
    },
    this);
    
    this.show();
  }
});


function trim(s) {
  var l=0; var r=s.length -1;
  while(l < s.length && s[l] == ' ') { l++; }
  while(r > l && s[r] == ' ') { r-=1; }
  return s.substring(l, r+1);
}
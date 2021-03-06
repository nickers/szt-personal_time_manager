
var real_data = [
    {
        "description": "test", 
        "budget": 0, 
        "slug": "test", 
        "user": {
            "username": "nickers", 
            "id": 1
        }, 
        "parent_project": null, 
        "start_date": "2010-12-25 20:00:00", 
        "planned_work": "00:00:00", 
        "name": "test"
    }, 
    {
        "description": "", 
        "budget": 0, 
        "slug": "sub1", 
        "user": {
            "username": "nickers", 
            "id": 1
        }, 
        "parent_project": {
            "description": "test", 
            "budget": 0, 
            "slug": "test", 
            "user": {
                "username": "nickers", 
                "id": 1
            }, 
            "parent_project": null, 
            "start_date": "2010-12-25 20:00:00", 
            "planned_work": "00:00:00", 
            "name": "test"
        }, 
        "start_date": "2011-01-12 22:20:13", 
        "planned_work": "00:00:00", 
        "name": "sub1"
    }, 
    {
        "description": "", 
        "budget": 0, 
        "slug": "sub2", 
        "user": {
            "username": "nickers", 
            "id": 1
        }, 
        "parent_project": {
            "description": "test", 
            "budget": 0, 
            "slug": "test", 
            "user": {
                "username": "nickers", 
                "id": 1
            }, 
            "parent_project": null, 
            "start_date": "2010-12-25 20:00:00", 
            "planned_work": "00:00:00", 
            "name": "test"
        }, 
        "start_date": "2011-01-12 22:20:46", 
        "planned_work": "22:20:46", 
        "name": "sub2"
    }, 
    {
        "description": "", 
        "budget": 0, 
        "slug": "sub11", 
        "user": {
            "username": "nickers", 
            "id": 1
        }, 
        "parent_project": {
            "description": "", 
            "budget": 0, 
            "slug": "sub1", 
            "user": {
                "username": "nickers", 
                "id": 1
            }, 
            "parent_project": {
                "description": "test", 
                "budget": 0, 
                "slug": "test", 
                "user": {
                    "username": "nickers", 
                    "id": 1
                }, 
                "parent_project": null, 
                "start_date": "2010-12-25 20:00:00", 
                "planned_work": "00:00:00", 
                "name": "test"
            }, 
            "start_date": "2011-01-12 22:20:13", 
            "planned_work": "00:00:00", 
            "name": "sub1"
        }, 
        "start_date": "2011-01-12 22:21:02", 
        "planned_work": "22:21:02", 
        "name": "sub11"
    }
];

/**
 * 
 */
function create_projects_tree() {
  var tree = new qx.ui.treevirtual.TreeVirtual([ "Projekt", "Opis", "Start" ]);
  
  tree.set({ height : 60 });
  tree.setAlwaysShowOpenCloseSymbol(false);
  var resizeBehavior = tree.getTableColumnModel().getBehavior();
  resizeBehavior.set(0, { width:"1*", minWidth:100  });
  
  return tree;
}


/**
 * 
 */
function fill_tree_with_data(tree, data) {

  var dataModel = tree.getDataModel();
  var keys = ['name','description','start_date']

  var added = {};
  var i = 0;

  for (i=0; i<data.length; i++) {
    var real_data = data[i];
    var par = null;
    
    if (real_data['parent_project'] && real_data['parent_project']['slug'] in added)  { 
      par = added[real_data['parent_project']['slug']]; 
    }
    
    var nd = dataModel.addBranch(par, real_data['name'], false);
    
    var nnn = "-";
    if (real_data['parent_project']) {
      nnn = real_data['parent_project']['slug'];
    }
    
    for (var j=0; j<keys.length; j++) {
      dataModel.setColumnData(nd, j, real_data[keys[j]]);
    }
    
    added[real_data.name] = nd;
  }

  dataModel.setData();
}

function create_main_gui() {

  var gui = { pane:null, tree:null, buttons:[] };

  var main_pane = new qx.ui.splitpane.Pane("vertical");
  gui.pane = main_pane;
  
  
  // We want to use some of the high-level node operation convenience
  // methods rather than manually digging into the TreeVirtual helper
  // classes.  Include the mixin that provides them.
  qx.Class.include(qx.ui.treevirtual.TreeVirtual, qx.ui.treevirtual.MNode);
  
  //** top part of window **//
  gui.tree = create_projects_tree();
  fill_tree_with_data(gui.tree, real_data);

  var treeButtons = new qx.ui.container.Composite();
  treeButtons.setPadding(5);
  treeButtons.setLayout(new qx.ui.layout.VBox(5));
  
  var buttonsData = [
    ["add_project","Dodaj projekt główny"], 
    ["add_task", "Dodaj zadanie"],
    ["remove", "Usuń"],
    ["refresh", "Odśwież"]
  ];

  for (var i in buttonsData) {
  	var b = buttonsData[i];
  	gui.buttons[b[0]] = new qx.ui.form.Button(b[1]);
  	treeButtons.add(gui.buttons[b[0]]);
  }

  var topBox = new qx.ui.container.Composite();
  topBox.setLayout(new qx.ui.layout.HBox());
  topBox.add(gui.tree, {flex:1});
  topBox.add(treeButtons, {flex:0});

  main_pane.add(topBox, 0, {flex:0.1});

  //** bottom part of window - tabs with data **//
  
  return gui;
}

/*
var pane = new qx.ui.splitpane.Pane("vertical");


// We want to use some of the high-level node operation convenience
// methods rather than manually digging into the TreeVirtual helper
// classes.  Include the mixin that provides them.
qx.Class.include(qx.ui.treevirtual.TreeVirtual,
                 qx.ui.treevirtual.MNode);

// Use an HBox to hold the tree and the groupbox
var hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
hBox = pane;
//this.getRoot().add(hBox, { edge : 30 });
this.getRoot().add(pane, { edge : 10 });

// tree
var tree = new qx.ui.treevirtual.TreeVirtual(
    [
      "Tree",
      "Permissions",
      "Last Accessed"
    ]);
tree.set(
  {
    height : 60
  });
tree.setAlwaysShowOpenCloseSymbol(false);

// Obtain the resize behavior object to manipulate
var resizeBehavior = tree.getTableColumnModel().getBehavior();

// Ensure that the tree column remains sufficiently wide
resizeBehavior.set(0, { width:"1*", minWidth:100  });


// top tree + buttons

var topBox = new qx.ui.container.Composite();
topBox.setLayout(new qx.ui.layout.HBox());
//win.add(buttonContainer, {flex:6});

//grid.setRowFlex(row, 1);
//grid.setColumnFlex(column, 1);
//buttonContainer.add(button, {row: row, column: column});

var treeButtons = new qx.ui.container.Composite();
treeButtons.setPadding(5);
treeButtons.setLayout(new qx.ui.layout.VBox(5));

treeButtons.add(new qx.ui.form.Button("Dodaj projekt główny"));
treeButtons.add(new qx.ui.form.Button("Dodaj zadanie"));
treeButtons.add(new qx.ui.form.Button("Usuń"));
treeButtons.add(new qx.ui.form.Button("Odśwież"));

topBox.add(tree, {flex:1});
topBox.add(treeButtons, {flex:0});

hBox.add(topBox, 0, {flex:0.1});

// tree data model
var dataModel = tree.getDataModel();

//////////////////////////////////////////////////////////////////
/// ---- my work -----
/// ----
var keys = ['name','description','start_date']

var added = {};
var i = 0;
for (i=0; i<real_data.length; i++) {
  var par = null;
  if (real_data[i]['parent_project'] 
  && real_data[i]['parent_project']['slug'] in added) par = added[real_data[i]['parent_project']['slug']];
  var nd = dataModel.addBranch(par, real_data[i]['name'], false);
  var nnn = "-";
  if (real_data[i]['parent_project']) {
    nnn = real_data[i]['parent_project']['slug'];
  }
  
  var j=0;
  for (j=0; j<keys.length; j++)
  {
    dataModel.setColumnData(nd, j, real_data[i][keys[j]]);
  }
  
  added[real_data[i].name] = nd;
//{
//    "description": "test", 
//    "budget": 0, 
//    "slug": "test", 
//    "user": {
//        "username": "nickers", 
//        "id": 1
//    }, 
//    "parent_project": null, 
//    "start_date": "2010-12-25 20:00:00", 
//    "planned_work": "00:00:00", 
//    "name": "test"
//}
  
}

// ---- end of my work ----

dataModel.setData();
*/

///////////////////////////////////////////////////////////////////////////////////////////////////
	var gui = create_main_gui();
	var hBox = gui.pane;
	this.getRoot().add(hBox, { edge : 10 });



var commandFrame = new qx.ui.groupbox.GroupBox("Control");
commandFrame.setLayout(new qx.ui.layout.Canvas());



var tabView = new qx.ui.tabview.TabView();

var page1 = new qx.ui.tabview.Page("Layout", "icon/16/apps/utilities-terminal.png");
page1.setLayout(new qx.ui.layout.Grow());
var conta = new qx.ui.container.Scroll();
conta.add(commandFrame, { border: 0 } );
page1.add(conta);
tabView.add(page1);

var page2 = new qx.ui.tabview.Page("Gantt", "icon/16/apps/utilities-terminal.png");
page2.setLayout(new qx.ui.layout.Grow());
conta = new qx.ui.container.Scroll();
conta.add(commandFrame, { border: 0 } );
page1.add(conta);
tabView.add(page2);


hBox.add(tabView, 1, {flex:0.7});

//////hBox.add(commandFrame);




var o = new qx.ui.basic.Atom("Current Selection: ");
commandFrame.add(o, { left: 0, top: 6 });

o = new qx.ui.form.TextField();
o.set({ readOnly: true });
commandFrame.add(o, { left : 4, right : 0, top : 20 });

gui.tree.addListener(
  "changeSelection",
  function(e)
  {
    // Get the list of selected nodes.  We're in single-selection mode,
    // so there will be only one of them.
    var nodes = e.getData();
    if (nodes.length)
    {
      this.setValue(gui.tree.getHierarchy(nodes[0].nodeId).join('/'));
      buttonRemove.setEnabled(true);
    }
    else
    {
      this.setValue("");
      buttonRemove.setEnabled(false);
    }
  },
  o);

var buttonRemove = new qx.ui.form.Button("Remove");
buttonRemove.set({ enabled: false });
commandFrame.add(buttonRemove, { top : 50, left : 0 });
buttonRemove.addListener(
  "execute",
  function(e)
  {
    var selectedNodes = gui.tree.getSelectedNodes();
    for (var i = 0; i < selectedNodes.length; i++)
    {
      dataModel.prune(selectedNodes[i].nodeId, true);
      dataModel.setData();
    }
  });

o = new qx.ui.form.CheckBox("Exclude first-level tree lines?");
o.set({ value: false });
commandFrame.add(o, { top : 100, left : 0 });
o.addListener("changeValue",
              function(e)
              {
                gui.tree.setExcludeFirstLevelTreeLines(e.getData());
              });

o = new qx.ui.form.CheckBox("Always show open/close symbol?");
o.set({ value: true });
commandFrame.add(o, { top : 120, left : 0 });
o.addListener("changeValue",
              function(e)
              {
                gui.tree.setAlwaysShowOpenCloseSymbol(e.getData());
              });

o = new qx.ui.form.CheckBox("Remove open/close if found empty?");
o.set({ value: true });
commandFrame.add(o, { top : 140, left : 0 });
gui.tree.addListener("treeOpenWhileEmpty",
                 function(e)
                 {
                   if (this.getValue())
                   {
                     var node = e.getData();
                     gui.tree.nodeSetHideOpenClose(node, true);
                   }
                 },
                 o);

o = new qx.ui.form.CheckBox("Open/close click selects row?");
o.set({ value: false });
commandFrame.add(o, { top : 160, left : 0 });
o.addListener("changeValue",
              function(e)
              {
                gui.tree.setOpenCloseClickSelectsRow(e.getData());
              });

o = new qx.ui.form.CheckBox("Disable the tree?");
o.set({ value: false });
commandFrame.add(o, { top : 180, left : 0 });
o.addListener("changeValue",
              function(e)
              {
                gui.tree.setEnabled(! e.getData());
              });

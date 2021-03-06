
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

// We want to use some of the high-level node operation convenience
// methods rather than manually digging into the TreeVirtual helper
// classes.  Include the mixin that provides them.
qx.Class.include(qx.ui.treevirtual.TreeVirtual,
                 qx.ui.treevirtual.MNode);

// Use an HBox to hold the tree and the groupbox
var hBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
this.getRoot().add(hBox, { edge : 30 });

// tree
var tree = new qx.ui.treevirtual.TreeVirtual(
    [
      "Tree",
      "Permissions",
      "Last Accessed"
    ]);
tree.set(
  {
    width  : 400
  });
tree.setAlwaysShowOpenCloseSymbol(false);

// Obtain the resize behavior object to manipulate
var resizeBehavior = tree.getTableColumnModel().getBehavior();

// Ensure that the tree column remains sufficiently wide
resizeBehavior.set(0, { width:"1*", minWidth:100  });

hBox.add(tree);

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
/*{
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
}*/
  
}

// ---- end of my work ----


/*
var te1 = dataModel.addBranch(null, "Desktop", true);
tree.nodeSetLabelStyle(te1,
                       "background-color: red; " +
                       "color: white;" +
                       "font-weight: bold;");

var te1_1;

dataModel.addBranch(te1, "Files", true);

te1_1 = dataModel.addBranch(te1, "Workspace", false);
dataModel.setColumnData(te1_1, 1, "-rwxr-xr-x");
var te = dataModel.addLeaf(te1_1, "Windows (C:)");
dataModel.setColumnData(te, 1, "-rwxr-xr-x");
dataModel.setColumnData(te, 2, "2007-01-30 22:54:03");
te = dataModel.addLeaf(te1_1, "Documents (D:)");
dataModel.setColumnData(te, 1, "-rwxr-xr-x");
dataModel.setColumnData(te, 2, "2007-01-30 22:54:03");

dataModel.addBranch(te1, "Network", true);

te = dataModel.addBranch(te1, "Trash", true);
tree.nodeSetCellStyle(te, "background-color: cyan;");

var te2 = dataModel.addBranch(null, "Inbox", true);

te = dataModel.addBranch(te2, "Spam", false);

for (var i = 1; i < 3000; i++)
{
  dataModel.addLeaf(te, "Spam Message #" + i);
}

dataModel.addBranch(te2, "Sent", false);
dataModel.addBranch(te2, "Trash", false);
dataModel.addBranch(te2, "Data", false);
dataModel.addBranch(te2, "Edit", false);
*/
dataModel.setData();

var commandFrame = new qx.ui.groupbox.GroupBox("Control");
commandFrame.setLayout(new qx.ui.layout.Canvas());

hBox.add(commandFrame);

var o = new qx.ui.basic.Atom("Current Selection: ");
commandFrame.add(o, { left: 0, top: 6 });

o = new qx.ui.form.TextField();
o.set({ readOnly: true });
commandFrame.add(o, { left : 4, right : 0, top : 20 });

tree.addListener(
  "changeSelection",
  function(e)
  {
    // Get the list of selected nodes.  We're in single-selection mode,
    // so there will be only one of them.
    var nodes = e.getData();
    if (nodes.length)
    {
      this.setValue(tree.getHierarchy(nodes[0].nodeId).join('/'));
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
    var selectedNodes = tree.getSelectedNodes();
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
                tree.setExcludeFirstLevelTreeLines(e.getData());
              });

o = new qx.ui.form.CheckBox("Always show open/close symbol?");
o.set({ value: true });
commandFrame.add(o, { top : 120, left : 0 });
o.addListener("changeValue",
              function(e)
              {
                tree.setAlwaysShowOpenCloseSymbol(e.getData());
              });

o = new qx.ui.form.CheckBox("Remove open/close if found empty?");
o.set({ value: true });
commandFrame.add(o, { top : 140, left : 0 });
tree.addListener("treeOpenWhileEmpty",
                 function(e)
                 {
                   if (this.getValue())
                   {
                     var node = e.getData();
                     tree.nodeSetHideOpenClose(node, true);
                   }
                 },
                 o);

o = new qx.ui.form.CheckBox("Open/close click selects row?");
o.set({ value: false });
commandFrame.add(o, { top : 160, left : 0 });
o.addListener("changeValue",
              function(e)
              {
                tree.setOpenCloseClickSelectsRow(e.getData());
              });

o = new qx.ui.form.CheckBox("Disable the tree?");
o.set({ value: false });
commandFrame.add(o, { top : 180, left : 0 });
o.addListener("changeValue",
              function(e)
              {
                tree.setEnabled(! e.getData());
              });


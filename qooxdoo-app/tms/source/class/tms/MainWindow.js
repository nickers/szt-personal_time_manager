qx.Class.define("tms.MainWindow",
{
  extend : qx.ui.window.Window,
//    extend : qx.ui.

  construct : function(root)
  {
  	this.do_it(root);
  },

  members: {
  create_projects_tree : function() {
    var tree = new qx.ui.treevirtual.TreeVirtual([ "Projekt", "Opis", "Start" ]);
    
    tree.set({ height : 60 });
    tree.setAlwaysShowOpenCloseSymbol(false);
    var resizeBehavior = tree.getTableColumnModel().getBehavior();
    resizeBehavior.set(0, { width:"1*", minWidth:100  });
    
    return tree;
  },


	fill_tree_with_data : function(tree, data) {
    var dataModel = tree.getDataModel();
    dataModel.clearData();
    var keys = ['name','description','start_date']

    var added = {};
  
    for (var i=0; i<data.length; i++) {
      var real_data = data[i];     
      
      var par = null;
      
      if (real_data.parent_project && real_data.parent_project.slug in added)  { 
        par = added[real_data.parent_project.slug]; 
      }
      
      var nd = dataModel.addBranch(par, real_data.name, false);
      
      for (var j=0; j<keys.length; j++) {
        dataModel.setColumnData(nd, j, real_data[keys[j]]);
      }
      dataModel.setUserData(nd, real_data);
      
      added[real_data.slug] = nd;
    }
    
    dataModel.setData();
  },

	create_main_gui : function() {
	  var gui = { pane:null, tree:null, buttons:[], project_data:null };
	  
	  

	  var main_pane = new qx.ui.splitpane.Pane("vertical");
	  gui.pane = main_pane;

	  // We want to use some of the high-level node operation convenience
	  // methods rather than manually digging into the TreeVirtual helper
	  // classes.  Include the mixin that provides them.
	  qx.Class.include(qx.ui.treevirtual.TreeVirtual, qx.ui.treevirtual.MNode);
	  
	  //** top part of window **//
	  gui.tree = this.create_projects_tree();
	  //this.fill_tree_with_data(gui.tree, real_data);

	  var treeButtons = new qx.ui.container.Composite();
	  treeButtons.setPadding(5);
	  treeButtons.setLayout(new qx.ui.layout.VBox(5));
	  
	  var buttonsData = [
  		["add_project","Dodaj projekt główny", true], 
  		["add_task", "Dodaj zadanie", false],
  		["remove", "Usuń", false],
  		["refresh", "Odśwież", true]
	  ];

	  for (var i=0; i<buttonsData.length; i++) {
	  	var b = buttonsData[i];
	  	gui.buttons[b[0]] = new qx.ui.form.Button(b[1]);
	  	gui.buttons[b[0]].setEnabled(b[2]);
	  	treeButtons.add(gui.buttons[b[0]]);
	  }

	  var topBox = new qx.ui.container.Composite();
	  topBox.setLayout(new qx.ui.layout.HBox());
	  topBox.add(gui.tree, {flex:1});
	  topBox.add(treeButtons, {flex:0});

	  main_pane.add(topBox, 0, {flex:0.1});

	  //** bottom part of window - tabs with data **//
	  
	  
	  // ## *** data *** ## //
    var data_src = new tms.ProjectsData();
    gui.project_data = data_src;
    
    data_src.addListener("changeProjects", function(e) {
        if (e.getData()!=null) this.fill_tree_with_data(gui.tree, e.getData());
      },
      this
    );
        
    main_pane.addListener("appear", function() { data_src.fetchProjects(); }, this);
    
    gui.buttons["refresh"].addListener("execute", function() { data_src.fetchProjects(); }, this);
    gui.buttons["add_project"].addListener("execute", function() {
      var addWindow = new tms.AddProjectWindow(gui.project_data, null);
      addWindow.show();
    }, this);
    
    
	  return gui;
	},


	do_it : function(root)
	{
		var gui = this.create_main_gui();

		var hBox = gui.pane;
		root.add(hBox, { edge : 10 });


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


    var notesTab = new tms.NotesTab();
    tabView.add(notesTab);

		hBox.add(tabView, 1, {flex:0.7});

		//////hBox.add(commandFrame);




		var o = new qx.ui.basic.Atom("Current Selection: ");
		commandFrame.add(o, { left: 0, top: 6 });

		o = new qx.ui.form.TextField();
		o.set({ readOnly: true });
		commandFrame.add(o, { left : 4, right : 0, top : 20 });

		gui.tree.addListener(
		  "changeSelection",
		  function(e) {
  			// Get the list of selected nodes.  We're in single-selection mode,
  			// so there will be only one of them.
  			var nodes = e.getData();
  			if (nodes.length) {
  			  this.setValue(gui.tree.getHierarchy(nodes[0].nodeId).join('/'));
  			  buttonRemove.setEnabled(true);
  			  
  			  // tabs on bottom
  			  var proj_obj = gui.tree.getDataModel().getUserData(nodes[0].nodeId);
  			  var proj = proj_obj.slug;
  			  notesTab.setProject(proj);
  			  
  			  // remove proj button
          gui.buttons["remove"].setEnabled(true);
          gui.buttons["add_task"].setEnabled(proj_obj.parent_project?false:true);
  			  
  			} else {
  			  this.setValue("");
  			  buttonRemove.setEnabled(false);
  			  gui.buttons["remove"].setEnabled(false);
  			  gui.buttons["add_task"].setEnabled(false);
  			  notesTab.setProject(null);
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
		    var dataModel = gui.tree.getDataModel();
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
		
		
	}	
  }		
	
});

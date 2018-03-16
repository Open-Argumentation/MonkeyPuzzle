

var cy = null;
var mt = Mousetrap();
var slideout;
var cm = null;
var selected = [];
var position = null;
var layout = null;
var running = false;
var cyJson  = {};
var xhttp = new XMLHttpRequest();
var filename;
var json;
var defaultJSON = "{\"analyst_email\":\"40170722@live.napier.ac.uk\",\"analyst_name\":\"Nathan Mair\",\"created\":\"2018-02-23T02:27:36\",\"edges\":[{\"id\":\"a1s1\",\"source_id\":\"a1\",\"target_id\":\"s1\"},{\"id\":\"a2s1\",\"source_id\":\"a2\",\"target_id\":\"s1\"},{\"id\":\"a3s2\",\"source_id\":\"a3\",\"target_id\":\"s2\"},{\"id\":\"s2a5\",\"source_id\":\"s2\",\"target_id\":\"a5\"},{\"id\":\"s1a4\",\"source_id\":\"s1\",\"target_id\":\"a4\"},{\"id\":\"a4s2\",\"source_id\":\"a4\",\"target_id\":\"s2\"}],\"edited\":\"2018-02-23T02:27:36\",\"id\":\"94a975db-25ae-4d25-93cc-1c07c932e2f9\",\"metadata\":{},\"nodes\":[{\"id\":\"a1\",\"metadata\":{},\"sources\":[],\"text\":\"Every person is going to die\",\"type\":\"atom\"},{\"id\":\"a2\",\"metadata\":{},\"sources\":[],\"text\":\"You are a person\",\"type\":\"atom\"},{\"id\":\"a3\",\"metadata\":{},\"sources\":[],\"text\":\"If you are going to die then you should treasure every moment\",\"type\":\"atom\"},{\"id\":\"a4\",\"metadata\":{},\"sources\":[],\"text\":\"You are going to die\",\"type\":\"atom\"},{\"id\":\"a5\",\"metadata\":{},\"sources\":[],\"text\":\"You should treasure every moment\",\"type\":\"atom\"},{\"id\":\"s1\",\"name\":\"Default\\nSupport\",\"type\":\"scheme\"},{\"id\":\"s2\",\"name\":\"Default\\nSupport\",\"type\":\"scheme\"}],\"resources\": []}";
var focused;
var undo_stack = [];
var redo_stack = [];

var cola_params = {
    name: 'cola',
    animate: true,
    randomize: false, //set this to false as it makes undo/redo slightly smoother, also seems to keep unlinked nodes on screen after redraw
    padding: 100,
    fit: false,
    maxSimulationTime: 1500
};

initialise();

function initialise() {
	//load diagram if there is one in localStorage
	if (localStorage.getItem('state'))
	{
		loadJSON(localStorage.getItem('state'));
		initCytoscape();
	//else use default
	} else
	{
		localStorage.setItem("state",defaultJSON);
		json = import_json(defaultJSON);
		cyJson = export_cytoscape(json);
		initCytoscape();
	}
}

function loadJSON(json_value) {
	json = import_json(json_value);
	localStorage.setItem("state",JSON.stringify(get_sd()));
	//load any sources in the stored diagram state
	window.onload = function () {
		for (let res of json['resources']) {
			load_tab(res);
		}
	};
	cyJson = export_cytoscape(json);
	if(cy != null)
	{
		cy.elements().remove();
		cy.json({elements: JSON.parse(cyJson)});
		redraw_visualisation();
	}
}

function initCytoscape() {
cy = cytoscape({
	container: document.getElementById('cy'),
	ready: function(){ window.cy = this; },
	elements: JSON.parse(cyJson),
	style:[
		{ selector: 'node', style: { 
			'content': 'data(content)', 
			'text-opacity': 0.8, 
			'width' : 'auto',
			'height' : 'auto',
			'text-valign': 'bottom', 
			'text-halign': 'right',
			}
		},
		{ selector: '[typeshape]', style: { 
			'shape':'data(typeshape)'
			}
		},

		{ selector: 'edge', style: { 
			'line-color': '#9dbaea',
			'target-arrow-shape': 'triangle',
			'target-arrow-color': '#9dbaea', 
			'curve-style': 'bezier' 
			}
		},
		{ selector: ':selected', style: {
			'border-width':'3',
			'border-color':'#333333'
			}
		},
		{
			selector: '.atom-label', style:{
				'text-wrap': 'wrap',
				'text-max-width': 80,
			}
		},
		{
			selector: '.scheme-label', style:{
				'text-wrap': 'wrap',
			}
		}                    
		],
		boxSelectionEnabled: false,
		autounselectify: false,
		selectionType: 'single',
		minZoom: 0.05,
		maxZoom: 2

});
	
	layout = build_cola_layout();
	layout.run();

	cy.elements('node[type = "atom"]').qtip({
		content: 'Metadata about this atom',
		position: {
			my: 'top center',
			at: 'bottom center'
		},
		style: {
			classes: 'qtip-bootstrap',
			tip: {
				width: 16,
				height: 8
			}
		}
	});


   cy.edgehandles({
		toggleOffOnLeave: true,
		handleNodes: "node",
		handleSize: 20,
		handleColor: 'orange',
		handleHitThreshold: 8,
		handleLineWidth: 5,
		//handleLineType: 'flat',
		handleOutlineColor: 'grey',
		edgeType: function(){ return 'flat'; },
		complete: function(event, sourceNode, targetNode, addedEles){
			var source_id = targetNode[0].source().id();
			var target_id = targetNode[0].target().id();
			add_edge(source_id, target_id);
			update_local_storage();
			// ...
		}
	});

/*
 *
 * Set up context menus
 *
 * */
cm = cy.contextMenus({
    menuItems: [
      {
        id: 'edit-content',
        title: 'edit content',
        selector: 'node[type = "atom"]',
        onClickFunction: function (event) {
          var target = event.target || event.cyTarget;
          
        },
        hasTrailingDivider: false
      },
      {
        id: 'edit-metadata',
        title: 'edit metadata',
        selector: 'node[type = "atom"]',
        onClickFunction: function (event) {
          var target = event.target || event.cyTarget;
          
        },
        hasTrailingDivider: true
      },
      {
        id: 'change-scheme',
        title: 'change scheme',
        selector: 'node[type = "scheme"]',
        onClickFunction: function (event) {
          var target = event.target || event.cyTarget;
          
        },
        hasTrailingDivider: true
      },
      {
        id: 'remove',
        title: 'remove',
        selector: 'node, edge',
        onClickFunction: function (event) {
			var target = event.target || event.cyTarget;
			if (selected.length != 0) {
				for (let node in selected) {
					delete_nodes(selected[node]);
				}
				selected = [];
			} else {
				delete_edge(target.id());
				update_local_storage();
				target.remove();
			}
        },
        hasTrailingDivider: true
      },
      {
        id: 'add-atom',
        title: 'add atom',
        coreAsWell: true,
        onClickFunction: function (event) {

            position = event.position || event.cyPosition;
            var selected_text = get_selected_text();
			if (selected_text == undefined)
			{
				$('#newAtomModal').modal('show');
			} else {
				add_new_atom_node(selected_text);
			}
        }
      },
      {
        id: 'add-scheme',
        title: 'add scheme',
        coreAsWell: true,
        onClickFunction: function (event) {

            position = event.position || event.cyPosition;
            
            document.getElementById("sel1").options.selectedIndex=0;
            $('#newSchemeModal').modal('show');
        },
        hasTrailingDivider: true
      },
      {
        id: 'redraw',
        title: 'redraw',
        coreAsWell: true,
        onClickFunction: function (event) { redraw_visualisation(); },
        hasTrailingDivider: true
      },
	  {
        id: 'undo',
        title: 'undo',
        selector: 'node, edge',
        show: false,
        coreAsWell: true,
        onClickFunction: function (event) {
		  console.log(undo_stack);
		  undo();
        },
        hasTrailingDivider: false
      },
	  {
        id: 'redo',
        title: 'redo',
        selector: 'node, edge',
        show: false,
        coreAsWell: true,
        onClickFunction: function (event) {
		  redo();
		  if (redo_stack == []) {
			cm.hideMenuItem('redo');
		  }
        },
        hasTrailingDivider: true
      }
    ]
});

    cy.on('unselect', 'node', function (e){
        selected.pop(e);
    });

    cy.on('select', 'node', function (e){ 
		selected.push(e);
    });
	
	cy.on('tap', function (e){ 
		//when cytoscape is tapped remove any focus from HTML elements like the tab textareas
		//this mainly helps with keybinds
		$(':focus').blur();
    });

    cy.on('layoutstart', function(){
        running = true;
    });
    
    cy.on('layoutstop', function(){
        running = false;
    });

    $(".resource-pane").resizable({
        handleSelector: ".splitter",
        resizeHeight: false,
        resizeWidthFrom: 'right',
        onDragStart: function (e, $el, opt) {},
        onDragEnd: function (e, $el, opt) { 
            console.log("resize");  
            cy.resize(); 
        }
    });
}

/*
 *
 * Model Manipulation Functions
 *
 * */
	
	//******************************************************
	function add_new_atom_node(selected_text=null) {
		if (selected_text != null) {
			var content = selected_text;
			window.getSelection().removeAllRanges()
		} else {
			var content = document.getElementById("new_atom_content").value; 
		}
		var new_atom = add_atom(content);
		var atom_id = new_atom['id'];
		if (selected_text != null) {
			add_source(atom_id, focused, content, 0, 0);
		}
		cy.add([
            {group: "nodes", data: {id: atom_id.toString(),
                content: content, type: 'atom', typeshape: 'roundrectangle' }, classes: 'atom-label', locked: false, renderedPosition: position},
        ]);
		update_local_storage();
	}
	
	function get_selected_text() {
		var selected_text;
		if (window.getSelection().toString().length>0)
		{
			if(window.getSelection().baseNode.id=="textarea")
			{
				selected_text = window.getSelection().toString();
				console.log("'" + selected_text + "' selected")
				return selected_text;
			}
		}
	}
	
	function setFocused(element) {
		focused = document.getElementById(element.id).id;
	}
	
	function update_local_storage() {
		var undo_item = localStorage.getItem("state");
		undo_stack.push(JSON.parse(undo_item));
		redo_stack = [];
		cm.showMenuItem('undo');
		cm.hideMenuItem('redo');
		localStorage.setItem("state", JSON.stringify(get_sd()));
	}
	
	function undo() {
		if (undo_stack.length != 0)
		{
			var redo_item = JSON.parse(localStorage.getItem("state"));
			redo_stack.push(redo_item);
			state = undo_stack.pop();
			loadJSON(JSON.stringify(state));
			if (undo_stack.length == 0) {
				cm.hideMenuItem('undo');
			}
			cm.showMenuItem('redo');
		}
	}
	
	function redo() {
		if (redo_stack.length != 0)
		{
			var undo_item = JSON.parse(localStorage.getItem("state"));
			undo_stack.push(undo_item);
			state = redo_stack.pop();
			loadJSON(JSON.stringify(state));
			if (redo_stack.length == 0) {
				cm.hideMenuItem('redo');
			}
			cm.showMenuItem('undo');
		}
	}
	
	function change_title(tab_id) {
		title = document.getElementById('title_'+tab_id).value;
		update_resource(tab_id, null, title);
		update_local_storage();
	}
	
	function change_textarea(tab_id) {
		text = document.getElementById(tab_id).value;
		update_resource(tab_id, text, null);
		update_local_storage();
	}

	function dragover_handler(ev) {
		 ev.preventDefault();
		 // Set the dropEffect to move
		 ev.dataTransfer.dropEffect = "move"
	}
	
	function drop_handler(ev) {
		ev.preventDefault();
		console.log(position);
		position = {'x': ev.clientX-300, 'y': ev.clientY+200};
		console.log(position);
		add_new_atom_node(get_selected_text());
	}
	//******************************************************

    function add_new_scheme_node() {
        var scheme_idx = document.getElementById("sel1").options.selectedIndex;
        var scheme = document.getElementById("sel1").options[scheme_idx].text;
		var new_scheme = add_scheme(scheme);
		var scheme_id = new_scheme['id'];
		
        cy.add([
            {group: "nodes", data: {id: scheme_id.toString(),
                content: scheme, typeshape: 'diamond' }, classes: 'scheme-label', locked: false, renderedPosition: position},
        ]);
		update_local_storage();
    };

    function delete_nodes(event) {
		var target = event.target || event.cyTarget;
		var id = target.id();
		removed = target.remove();
		delete_atom(id);
		for (let edge of sd['edges']) {
			if (edge['source_id'] == id || edge['target_id'] == id) {
				delete_edge(edge['id']);
			}
		}
		update_local_storage();
    };

    function redraw_visualisation() {
        layout.stop();
        layout.options.eles = cy.elements();
        layout.run();
    };


/*
 *
 * Slideout functions
 *
 * */

    slideout = new Slideout( {
        'panel': document.getElementById('panel'),
        'menu': document.getElementById('menu'),
        'fx': 'ease',
        'side': 'right',
        'duration': 500,
        'padding': 256,
        'tolerance': 70
    });

    slideout.on('close', function() { cy.resize(); } );
    slideout.on('open', function() { cy.resize(); } );

/*
 *
 * Cola Layout Functions
 *
 *
 * */
 
function build_cola_layout( opts )
{
    for( var i in opts )
    {
        cola_params[i] = opts[i];
    }
        
    return cy.makeLayout( cola_params );
}

/* 
 *
 * Mousetrap - keypboard handler functions
 *
 * */
 //TODO: ADD FUNCTIONS

mt.bind('a', function() {
    //console.log("ADD NODE OR EDGE");
	
	var selected_text = get_selected_text();
	if (selected_text == undefined)
	{
		$('#newAtomModal').modal('show');
	} else {
		add_new_atom_node(selected_text);
	}
});

mt.bind('d', function() { 
    //console.log("DELETE SELECTED NODE");
    for (let node in selected) {
		delete_nodes(selected[node]);
	}
	selected = [];
});

mt.bind('f', function() {
    console.log("FIX NODE PLACEMENT");
});

mt.bind('s', function() {
    console.log("SCALE SELECTED NODE");
});

mt.bind('h', function() {
    console.log("hide resource pane");
    $( "#resource-pane" ).toggle();
    $( "#splitter" ).toggle();
});

mt.bind('t', function() {
    console.log("TOGGLE TEXT LABEL VISIBILITY");
});

mt.bind(['command+z','ctrl+z'], function() {
	//console.log("UNDO");
	undo();
});

mt.bind(['command+y','ctrl+y'], function() {
	//console.log("REDO");
	redo();
});


/*
 *
 * Modal Dialog Functions
 *
 * */

$('#newAtomModal').on('shown.bs.modal', function () {
    $('#new_atom_content').focus();
});

$('#newAtomModal').on('hidden.bs.modal', function(e) { 
    $('#new_atom_content').val('').end();    
});

$('#newSchemeModal').on('shown.bs.modal', function () {
    $('#sel1').focus();
});



$("#resource_text").blur(function() {
    console.log("blur")
});


$('.toggle-button').click(function() {
    if(slideout.isOpen()) { slideout.close(); }
    else { slideout.open(); }
});



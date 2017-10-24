var cy;
var mt = Mousetrap();
var slideout;
var cm = null;
var selected = [];
var position = null;
var layout = null;
var running = false;

var cola_params = {
    name: 'cola',
    animate: true,
    randomize: true,
    padding: 100,
    fit: true,
    maxSimulationTime: 1500
};


cy = cytoscape({
    container: document.getElementById('cy'),
    ready: function(){ window.cy = this; },
    elements:{
        nodes: [
        { data: { id: 'a1', content: 'Every person is going to die', 
            type: 'atom', typeshape: 'roundrectangle' }, 
            classes: 'atom-label' },
        { data: { id: 'a2', content: 'You are a person', 
            type: 'atom', typeshape: 'roundrectangle' },
            classes: 'atom-label' },
        { data: { id: 'a3', content: 'If you are going to die then you should treasure every moment',
            type: 'atom', typeshape: 'roundrectangle' }, 
            classes: 'atom-label' },
        { data: { id: 'a4', content: 'You are going to die', 
            type: 'atom', typeshape: 'roundrectangle' }, 
            classes: 'atom-label' },
        { data: { id: 'a5', content: 'You should treasure every moment', 
            type: 'atom', typeshape: 'roundrectangle' },
            classes: 'atom-label' },

        { data: { id: 's1', content: 'Default\nSupport', type: 'scheme', typeshape: 'diamond'  },
            classes: 'scheme-label' },
        { data: { id: 's2', content: 'Default\nSupport', type: 'scheme', typeshape: 'diamond'  },
            classes: 'scheme-label'},
        ],
        edges: [

        { data: { id: 'a1s1', source: 'a1', target: 's1' } },
        { data: { id: 'a2s1', source: 'a2', target: 's1' } },
        { data: { id: 'a3s2', source: 'a3', target: 's2' } },
        { data: { id: 's2a5', source: 's2', target: 'a5' } },
        { data: { id: 's1a4', source: 's1', target: 'a4' } },
        { data: { id: 'a4s2', source: 'a4', target: 's2' } },
        ]
        },
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
        edgeType: function(){ return 'flat'; }
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
          removed = target.remove();
          
          cm.showMenuItem('undo-last-remove');
        },
        hasTrailingDivider: true
      },
      {
        id: 'undo-last-remove',
        title: 'undo last remove',
        selector: 'node, edge',
        show: false,
        coreAsWell: true,
        onClickFunction: function (event) {
          if (removed) {
            removed.restore();
          }
          cm.hideMenuItem('undo-last-remove');
        },
        hasTrailingDivider: true
      },
      {
        id: 'add-atom',
        title: 'add atom',
        coreAsWell: true,
        onClickFunction: function (event) {

            position = event.position || event.cyPosition;
            
           // document.getElementById("new_atom_content").options.selectedIndex=0;
            $('#newAtomModal').modal('show');
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
      }
    ]
});


    cy.on('unselect', 'node', function (e)
    {
        selected.pop(this.id());
        console.log(selected);
    });

    cy.on('tap', 'node', function (e)
    { 
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


/*
 *
 * Model Manipulation Functions
 *
 * */

    function add_new_atom_node() {
        var new_content = document.getElementById("new_atom_content").value; 
        cy.add([
            {group: "nodes", data: {id: Math.floor(Math.random() * 1024).toString(), 
                content: new_content, typeshape: 'roundrectangle' }, classes: 'atom-label', locked: false, renderedPosition: position},
        ]);
        redraw_visualisation();
        console.log( cy.elements().jsons() );
    }

    function add_new_scheme_node() {
        var scheme_idx = document.getElementById("sel1").options.selectedIndex;
        var scheme = document.getElementById("sel1").options[scheme_idx].text;
        cy.add([
            {group: "nodes", data: {id: Math.floor(Math.random() * 1024).toString(), 
                content: scheme, typeshape: 'diamond' }, classes: 'scheme-label', locked: false, renderedPosition: position},
        ]);
    };

    function delete_nodes() {    
        cy.remove( cy.getElementById(selected[0]) );
        selected = []
    };

    function download(text, name, type) {
        console.log("DL");
        var a = document.getElementById("export_button");
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
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

mt.bind('a', function() {
    console.log("ADD NODE OR EDGE");
});

mt.bind('d', function() { 
    console.log("DELETE SELECTED NODE");
    delete_nodes()
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



/*
 *
 *  Keypboard handler functions
 *
 *  These all make use of the mousetrap library
 *
 * */

var mt = Mousetrap();

mt.bind("a", function() { $("#newAtomModal").modal("show"); });

mt.bind("d", function() {
    selected.forEach(function(node) {
        delete_nodes(node);
    });
    selected = [];
});

mt.bind("h", function() {
    create_help_modal();
    $("#help_modal").modal("show"); 
});

mt.bind("m", function() { toggle_menu(); });
mt.bind("r", function() { toggle_resource_pane(); });
mt.bind("s", function() { $("#newSchemeModal").modal("show"); });

mt.bind("t", function() {
    create_resource_pane_selection_modal();
    $("#resource_pane_selection_modal").modal("show"); 

});

mt.bind("g", function() { if(selected.length>1) {$("#newGroupModal").modal("show"); }});

mt.bind("v", function() { 
    create_sadface_viewer_modal();
    $("#SADFaceViewerModal").modal("show"); 
});


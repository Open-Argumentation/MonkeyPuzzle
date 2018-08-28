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

mt.bind("f", function() { console.log("FIX NODE PLACEMENT"); });
mt.bind("h", function() { $("#help_modal").modal("show"); });
mt.bind("m", function() { toggle_menu(); });
mt.bind("r", function() { toggle_resource_pane(); });
mt.bind("s", function() { console.log("SCALE SELECTED NODE"); });
mt.bind("t", function() { $("#resource_pane_selection_modal").modal("show"); });
mt.bind(["command+z","ctrl+z"], function() { undo(); });
mt.bind(["command+y","ctrl+y"], function() { redo(); });

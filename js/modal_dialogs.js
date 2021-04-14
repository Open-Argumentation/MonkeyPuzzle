function new_atom_modal() {
    var new_content = document.getElementById("new_atom_content").value;
    add_new_atom_node(new_content);
}

function new_compound_modal() {
    var new_name = document.getElementById("new_compound_content").value;
    create_compound_argument(new_name)
}

$("#newAtomModal").on("shown.bs.modal", function () { $("#new_atom_content").focus(); });
$("#newAtomModal").on("hidden.bs.modal", function(e) { $("#new_atom_content").val("").end(); });

$("#newCompoundModal").on("shown.bs.modal", function () { $("#new_compound_content").focus(); });

$("#newSchemeModal").on("shown.bs.modal", function () { $("#sel1").focus(); });

$("#editContentModal").on("show.bs.modal", function() { });

$("#editMetadataModal").on("show.bs.modal", function() { });

$("#resource_pane_selection_modal").on("shown.bs.modal", function () { $("#resource_type").focus(); });

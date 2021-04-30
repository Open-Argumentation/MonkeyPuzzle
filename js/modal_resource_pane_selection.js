function create_resource_pane_selection_modal() {
    if (!document.getElementById("resource_pane_selection_modal")){
        var div = document.createElement("div");
        div.className = "modal fade";
        div.id = "resource_pane_selection_modal";
        div.role = "dialog";
        div.tabindex='-1';
        doc = prettyprint(get_sd());

        div.innerHTML = '<div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" onclick="destroy_resource_pane_selection_modal()">&times;</button> <h4 class="modal-title">New Resource Pane</h4> </div> <div class="modal-body"> <p>Select a resource type</p> <select class="form-control" id="resource_type"> <option>Text</option> </select> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="destroy_resource_pane_selection_modal()">Close</button><button type="button" class="btn btn-primary" data-dismiss="modal" onclick="invoke_add_tab(); destroy_resource_pane_selection_modal();">Add</button> </div> </div> </div>';

        document.body.appendChild(div);
    }

}

function destroy_resource_pane_selection_modal() {
    var div = document.getElementById("resource_pane_selection_modal");
    do {
        div = document.getElementById("resource_pane_selection_modal");
        if (div != null) {
            div.parentNode.removeChild(div);
        }
    } while(div != null);
}

$('body').on('shown.bs.modal', '#resource_pane_selection_modal', function () {
    $('#resource_type:visible:enabled:first', this).focus();
})

function invoke_add_tab(){
    var resource_type_idx = document.getElementById("resource_type").options.selectedIndex;
    var resource_type_txt = document.getElementById("resource_type").options[resource_type_idx].text;
    add_tab(null, resource_type_txt.toLowerCase());
}


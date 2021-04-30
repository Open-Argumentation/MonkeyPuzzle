function create_edit_metadata_modal(node_id, metadata) {
    if (!document.getElementById("edit_metadata_modal")){
        var div = document.createElement("div");
        div.className = "modal fade";
        div.id = "edit_metadata_modal";
        div.role = "dialog";
        div.tabindex='-1';
        doc = prettyprint(get_sd());
        
        div.innerHTML = `
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" onclick="destroy_edit_metadata_modal();">&times;</button>
                <h4 class="modal-title">Edit Metadata</h4>
            </div>
            <div class="modal-body">
                <p>Edit atom content</p>
                <div class="form-group" id="edit_metadata">
                <textarea id="modal_metadata_content" class="form-control" rows="2" >`
                +metadata+
                `</textarea>
               </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="destroy_edit_metadata_modal();">Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick='save_new_metadata("`+node_id+`");'>Save</button>
            </div>
          </div>
        </div>
        `;

        document.body.appendChild(div);
    }

}

function destroy_edit_metadata_modal() {
    var div = document.getElementById("edit_metadata_modal");
    do {
        div = document.getElementById("edit_metadata_modal");
        if (div != null) {
            div.parentNode.removeChild(div);
        }
    } while(div != null);
}

function save_new_metadata(node_id) {
    content = document.getElementById("modal_metadata_content").value;
    if (JSON.parse(content)) {
        var metadata = JSON.parse(content);
        update_atom_metadata(node_id, metadata);
        update_local_storage();
        edit_atom=null;
    } else {
        alert("Metadata not in JSON format, unable to update");
    }
    destroy_edit_metadata_modal();
}

$('body').on('shown.bs.modal', '#edit_metadata_modal', function () {
    $('#modal_metadata_content:visible:enabled:first', this).focus();
})



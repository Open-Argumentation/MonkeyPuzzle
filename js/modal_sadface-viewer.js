function create_sadface_viewer_modal() {
    if (!document.getElementById("SADFaceViewerModal")){
        var div = document.createElement("div");
        div.className = "modal fade";
        div.id = "SADFaceViewerModal";
        div.role = "dialog";
        doc = prettyprint(get_sd());

        div.innerHTML = '<div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" onclick="destroy_sadface_viewer_modal()">&times;</button> <h4 class="modal-title">SADFace Document</h4> </div> <div class="modal-body"> <p>This is the SADFace model that underpins the current visualisation</p> <div class="form-group"> <textarea class="form-control" rows="12" id="sadface_document_content" autofocus>'+doc+'</textarea> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="destroy_sadface_viewer_modal()">Close</button> <button type="button" class="btn btn-primary" onclick="copy_to_clipboard()">Copy to clipboard</button> </div> </div> </div>';

        document.body.appendChild(div);
    }

}

function destroy_sadface_viewer_modal() {
    var div = document.getElementById("SADFaceViewerModal");
    do {
        div = document.getElementById("SADFaceViewerModal");
        if (div != null) {
            div.parentNode.removeChild(div);
        }
    } while(div != null);
}


function copy_to_clipboard() {
    document.getElementById("sadface_document_content").select();
    document.execCommand('copy');
}

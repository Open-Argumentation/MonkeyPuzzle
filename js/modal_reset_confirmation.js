function create_reset_modal() {
    if (!document.getElementById("reset_modal")){
        var div = document.createElement("div");
        div.className = "modal fade";
        div.id = "reset_modal";
        div.role = "dialog";
        div.tabindex='-1';
        doc = prettyprint(get_sd());

        div.innerHTML = '<div class="modal-dialog modal-lg"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" onclick="destroy_reset_modal()">&times;</button> <h4 class="modal-title">Reset MonkeyPuzzle</h4> </div> <div class="modal-body"> <p>Are you sure that you want to reset MonkeyPuzzle?<br /> This will empty the current analysis and adjust all options back to their initial settings.</p> </div> <div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-danger" data-dismiss="modal" onclick="mp_reset()">Reset</button> </div> </div> </div>';

        document.body.appendChild(div);
    }

}

function destroy_reset_modal() {
    var div = document.getElementById("reset_modal");
    do {
        div = document.getElementById("reset_modal");
        if (div != null) {
            div.parentNode.removeChild(div);
        }
    } while(div != null);
}


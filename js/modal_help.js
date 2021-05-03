function create_help_modal() {
    if (!document.getElementById("help_modal")){
        var div = document.createElement("div");
        div.className = "modal fade";
        div.id = "help_modal";
        div.role = "dialog";
        div.tabindex='-1';
        doc = prettyprint(get_sd());

        div.innerHTML = `
        <div class="modal-dialog modal-lg"> 
            <div class="modal-content"> 
                <div class="modal-header"> 
                    <button type="button" class="close" data-dismiss="modal" onclick="destroy_help_modal()">&times;</button> 
                    <h4 class="modal-title">MonkeyPuzzle Help</h4> 
                </div> 
                <div class="modal-body"> 
                    <p>MonkeyPuzzle uses a 3 pane layout. The visualisation pane is in the center, the resource pane is to the left, and the application menu is to the right.</p> 
                    <p>Keybord Shortcuts:</p> 
                    <ul> 
                        <li><b>a - </b>Create a new atom</li> 
                        <li><b>d - </b>Delete the selected node</li> 
                        <li><b>h - </b>Display this delightfully helpful modal</li> 
                        <li><b>m - </b>Toggle display of the menu</li> 
                        <li><b>r - </b>Toggle display of the resource pane</li> 
                        <li><b>v - </b>Display the SADFace document for the current visualisation</li> 
                        <li><b>Cmd/Ctrl-z - </b>Undo</li> 
                        <li><b>Cmd/Ctrl-y - </b>Redo</li>
                        <li><b>Shift+Drag Pointer then g - </b> Select multiple nodes (atoms + schemes) then group them. </li>
                    </ul> 
                </div> 
                <div class="modal-footer"> 
                    <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="destroy_help_modal()">Dismiss</button> 
                </div> 
            </div> 
        </div>
        `;

        document.body.appendChild(div);
    }

}

function destroy_help_modal() {
    var div = document.getElementById("help_modal");
    do {
        div = document.getElementById("help_modal");
        if (div != null) {
            div.parentNode.removeChild(div);
        }
    } while(div != null);
}


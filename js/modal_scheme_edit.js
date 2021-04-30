function create_edit_scheme_modal() {
    if (!document.getElementById("edit_scheme_modal")){
        var div = document.createElement("div");
        div.className = "modal fade";
        div.id = "edit_scheme_modal";
        div.role = "dialog";
        div.tabindex='-1';
        doc = prettyprint(get_sd());
        
        div.innerHTML = `
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" onclick="destroy_edit_scheme_modal();">&times;</button>
                <h4 class="modal-title">Edit Scheme</h4>
            </div>
			<div class="modal-body">
                <p>Select a scheme</p>
                <select class="form-control" id="sel2">
                    <option>Support</option>
                    <option>Conflict</option>
                    <option>Argument from Sign</option>
					<option>Argument from an Exceptional Case</option>
					<option>Argument from Analogy</option>
					<option>Argument from Bias</option>
					<option>Argument from Cause to Effect</option>
					<option>Argument from Correlation to Causes</option>
					<option>Argument from Established Rule</option>
					<option>Argument from Evidence to a Hypothesis</option>
					<option>Argument from Falsification to a Hypothesis</option>
					<option>Argument from Example</option>
					<option>Argument from Commitment</option>
					<option>Circumstantial Argument Against the Person</option>
					<option>Argument from Popular Practice</option>
					<option>Argument from Popularity</option>
					<option>Argument from Position to Know</option>
					<option>Argument from Expert Opinion</option>
					<option>Argument from Precedent</option>
					<option>Argument from Consequences</option>
					<option>Argument from Waste</option>
                    <option>Causal Slippery Slope Argument</option>
                </select>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="destroy_edit_scheme_modal();">Close</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="edit_scheme_content(); destroy_edit_scheme_modal()">Save</button>
            </div>
          </div>
        </div>
        `;

        document.body.appendChild(div);
    }

}

function destroy_edit_scheme_modal() {
    var div = document.getElementById("edit_scheme_modal");
    do {
        div = document.getElementById("edit_scheme_modal");
        if (div != null) {
            div.parentNode.removeChild(div);
        }
    } while(div != null);
}

$('body').on('shown.bs.modal', '#edit_scheme_modal', function () {
    $('#sel2:visible:enabled:first', this).focus();
})



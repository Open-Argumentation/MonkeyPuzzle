function add_text_resource_body(tab_id) {
    var tab_body = $(`
        <div id="` + tab_id + `_body" class="resource_pane_tab_content">
            <form>
                <div class="form-group">
                        <button type="button" class="btn btn-default" onclick="remove_tab()" title="Remove this tab from the resource pane">
                            <i class="fa fa-trash fa-fw fa-lg"></i>
                        </button>
                        <input type="file" id="load` + tab_id + `" style="display:none" accept=".txt" onchange="filemanager('load','txt','` + tab_id + `')"/>
                        <button type="button" id="load` + tab_id + `_btn" class="btn btn-default" onclick="$('#load` + tab_id + `').trigger('click');" title="Load a text file into this resource tab">
                            <i class="fa fa-upload fa-fw fa-lg"></i>
                        </button>
                        <button type="button" class="btn btn-default" onclick="filemanager('save','txt','` + tab_id + `')" title="Save this resource tab to a text file">
                            <i class="fa fa-download fa-fw fa-lg"></i>
                        </button>
                        <button id="toggle_edit_lock_button" type="button" class="btn btn-default" title="Toggle editability of the content area" onclick="toggle_edit_lock();">
                            <i id="toggle_edit_lock_icon_` + tab_id + `" class="fa fa-lock fa-fw fa-lg"></i>
                        </button>
                        <button type="button" class="btn btn-default" title="Add node from text selection" onclick="new_atom_txt_resource_button();">
                            <i class="fa fa-puzzle-piece fa-fw fa-lg"></i>
                        </button>
                </div>
                <div class="form-group">
                    <label>File Name</label>
                    <textarea id="title_` + tab_id + `" type="text" rows="1" style="resize: none;" class="form-control" placeholder="The name of this resource..." onchange="change_title('` + tab_id + `')"></textarea> 
                    <label>Content</label>
                    <div id="textarea">
                        <textarea id="` + tab_id + `" class="form-control" placeholder="Enter your source text here..." rows="20" onchange="change_textarea('` + tab_id + `')" onfocus="set_focus(this)" style="resize: vertical; min-height:35px;" readonly></textarea>
                    </div>  
                </div> 
            </form>
        </div>
    `); 
    
    $(".tab_body").append(tab_body);
}

function set_text_resource_title(tab_id, title){
    update_resource(tab_id, null, title);
    update_local_storage();
}

function set_text_resource_content(tab_id, text){
    update_resource(tab_id, text, null);
    update_local_storage();
}

function change_title(tab_id) {
    var title = document.getElementById("title_"+tab_id).value;
    set_text_resource_title(tab_id, title)
}

function change_textarea(tab_id) {
    var text = document.getElementById(tab_id).value;
    set_text_resource_content(tab_id, text)
}

function new_atom_txt_resource_button() {   
    if(focused != null || focused != undefined){
        if(focused.parentNode.id == "textarea"){
            selected_text = get_selected_text();
            if(selected_text != null){
                add_new_atom_node(selected_text);
            }
        }
        focused == null;
    }
    else { console.log("Not a valid text source") }
}

function toggle_edit_lock() {
    if( document.getElementById(current_tab).hasAttribute('readonly') ) {
        document.getElementById(current_tab).removeAttribute('readonly');
        document.getElementById('toggle_edit_lock_icon_' + current_tab ).classList.toggle('fa-lock');
        document.getElementById('toggle_edit_lock_icon_' + current_tab ).classList.toggle('fa-unlock');      
    }
    else {
        document.getElementById(current_tab).setAttribute('readonly', 'readonly');
        document.getElementById('toggle_edit_lock_icon_' + current_tab ).classList.toggle('fa-unlock');
        document.getElementById('toggle_edit_lock_icon_' + current_tab ).classList.toggle('fa-lock');
    }
}

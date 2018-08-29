var current_tab = 0;
var last_number = 1;
var tabs = [];


/*
*   General Tab Management Functions
*/

function add_tab(load_id=null) {
	if (load_id == null) {
        var new_resource = add_resource(' ');
    	tab_id = new_resource.id;
	    add_resource_metadata(tab_id, 'title', '');
    	localStorage.setItem("state",JSON.stringify(get_sd()));
	} 
    else { tab_id = load_id; }

    add_resource_header();

    var resource_type_idx = document.getElementById("resource_type").options.selectedIndex;
    var resource_type_txt = document.getElementById("resource_type").options[resource_type_idx].text;
    if (resource_type_txt.toLowerCase() === "text") { add_text_resource_body(tab_id); }

    set_active_tab(tab_id+"_body");
    return tab_id
}

function add_resource_header() {
  	tab_number = next_number();
    tabs.push(tab_id);
    var resource_pane_tab_head = $(`
        <button id="`+ tab_id + `_btn" class="tablinks" 
            onclick="set_active_tab('` + tab_id + `_body')">` + 
            tab_number + `</button>
    `);

    $(".resource_pane_tab_head").append(resource_pane_tab_head);
}

function load_tab(resource) {
	if (resource != null) {
		var tab_id = resource.id;
        add_tab(tab_id);
        set_text_resource_title(tab_id, resource.metadata.title);
        set_text_resource_content(tab_id, resource.content);
	}
}

function next_number(){ return last_number++; }

function remove_tab(){
    $("#"+current_tab+"_btn").remove();
    $("#"+current_tab+"_body").remove();
    var idx = tabs.indexOf(current_tab);
	//remove resource and its sources from sd
	delete_resource(current_tab);
    sd.nodes.forEach((node) => {
		if (node.type == 'atom') {
			if (current_tab in node.sources) {
				delete_source(node.id, current_tab);
			}
		}
    });
	
	localStorage.setItem("state",JSON.stringify(get_sd()));
    if (tabs.length >= 1 && idx != -1)
    {
        tabs.splice(idx, 1);
        current_tab = tabs[tabs.length-1];
        set_active_tab(current_tab+"_body");
    }
}

function remove_all_tabs() {
    var i = 0;
    tabs.forEach((tab) => {
		$("#"+tabs[i]+"_btn").remove();
		$("#"+tabs[i]+"_body").remove();
        ++i;
    });
}

function set_active_tab(tab_id) {
    if(tabs.length > 0){
        current_tab = tab_id.substring( 0, tab_id.indexOf("_body") );
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("resource_pane_tab_content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
		if (document.getElementById(tab_id)) {
			document.getElementById(tab_id).style.display = "block";
			document.getElementById(current_tab+"_btn").className += " active";
		}
    }
}

function toggle_resource_pane() {
    if(resource_pane_viewable_state == true)
    {
        $('#resource-pane').children().hide(); 
        $('#resource-pane').hide(); 
        resource_pane_viewable_state = false;
    }
    else
    {
        $('#resource-pane').show(); 
        $('#resource-pane').children().show();
        resource_pane_viewable_state = true;
    }
    cy.center();
    cy.resize();
}

/*
*   Text Tab Specific Functions
*/

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

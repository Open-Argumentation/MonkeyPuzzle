var current_tab = 0;
var last_number = 1;
var tabs = [];
//var content_lock = true;

function set_active_tab(tab_id) {
    if(tabs.length > 0){
        current_tab = tab_id.substring( 0, tab_id.indexOf("_body") );
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
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

function load_tab(resource) {
	if (resource != null) {
		var tab_id = resource.id;
		var tab_content = resource.content;
		var tab_title = resource.metadata.title;
		add_tab(tab_id, tab_content, tab_title);
	}
}

function add_tab(load_id=null, content='',title='') {
	if (load_id == null) {
		tab_id = add_tab_resource();
	} else {
		tab_id = load_id;
	}
	tab_number = next_number();
    tabs.push(tab_id);

    // Create the tab header bar using a multiline declaration enclosed in backticks
    var tab_head = $(`
        <button id="`+ tab_id + `_btn" class="tablinks" onclick="set_active_tab('` + tab_id + `_body')">` + tab_number + `</button>
    `);

    $(".tab_head").append(tab_head);

    // Create the tab body using a multiline declaration enclosed in backticks
    var tab_body = $(`
        <div id="` + tab_id + `_body" class="tabcontent">
            <form>
                <div class="form-group">
                    <span class="upload-span">
                        <button type="button" class="btn btn-default" onclick="remove_tab()" title="Remove this tab from the resource pane">
                            <i class="fa fa-trash fa-fw fa-lg"></i>
                        </button>
                    </span>
                    <span class="upload-span">
                        <a role="button" rel="ignore">
                            <div display="inline-block" class="btn btn-default" uiconfig="[object Object]">
                                <div>
                                    <i class="fa fa-upload fa-fw fa-lg"></i>
                                </div>
                            </div>
                            <div display="inline-block">
                                <input accept=".txt" id="load` + tab_id + `" display="inline-block" role="button" tabindex="0" type="file" class="upload-button" onchange="filemanager('load','txt','` + tab_id + `')" title="Load a text file into this resource tab">
                            </div>
                        </a>
                    </span>
                    <span class="upload-span">
                        <button type="button" class="btn btn-default" onclick="filemanager('save','txt','` + tab_id + `')" title="Save this resource tab to a text file">
                            <i class="fa fa-download fa-fw fa-lg"></i>
                        </button>
                    </span>
                    <span class="upload-span">
                        <button id="toggle_edit_lock_button" type="button" class="btn btn-default" title="Toggle editability of the content area" onclick="toggle_edit_lock();">
                            <i id="toggle_edit_lock_icon_` + tab_id + `" class="fa fa-lock fa-fw fa-lg"></i>
                        </button>
                    </span>
                    <span class="upload-span">
                        <button type="button" class="btn btn-default" title="Add node from text selection" onclick="new_atom_txt_resource_button();">
                            <i class="fa fa-puzzle-piece fa-fw fa-lg"></i>
                        </button>
                    </span>
                </div>
                <div class="form-group">
                    <label>File Name</label>
                    <textarea id="title_` + tab_id + `" type="text" rows="1" style="resize: none;" class="form-control" placeholder="The name of this resource..." onchange="change_title('` + tab_id + `')">` + title + `</textarea> 
                    <label>Content</label>
                    <div id="textarea">
                        <textarea id="` + tab_id + `" class="form-control" placeholder="Enter your source text here..." rows="20" onchange="change_textarea('` + tab_id + `')" onfocus="set_focus(this)" style="resize: vertical; min-height:35px;" readonly>` + content + `</textarea>
                    </div>  
                </div> 
            </form>
        </div>
    `); 
    
    $(".tab_body").append(tab_body);
    set_active_tab(tab_id+"_body");
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

function add_tab_resource() {
	var new_resource = add_resource(' ');
	var resource_id = new_resource.id;
	add_resource_metadata(resource_id, 'title', '');
	localStorage.setItem("state",JSON.stringify(get_sd()));
	return resource_id;
}

function toggle_edit_lock() {
    if( document.getElementById(current_tab).hasAttribute('readonly') ) {
        document.getElementById(current_tab).removeAttribute('readonly');
        document.getElementById('toggle_edit_lock_icon_' + tab_id ).classList.toggle('fa-lock');
        document.getElementById('toggle_edit_lock_icon_' + tab_id ).classList.toggle('fa-unlock');       
    }
    else {
        document.getElementById(current_tab).setAttribute('readonly', 'readonly');
        document.getElementById('toggle_edit_lock_icon_' + tab_id ).classList.toggle('fa-unlock');
        document.getElementById('toggle_edit_lock_icon_' + tab_id ).classList.toggle('fa-lock');
    }
}

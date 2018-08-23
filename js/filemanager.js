function filemanager(operation, filetype, tab_id) 
{
	/*
	Write text from tab to file or does a SADFace save operation
	*/
	if ("save" == operation)	{
		// if it's a txt file
		if ("txt" == filetype) {	
			if (document.getElementById("title_"+tab_id).value !== '') {
				var filename = document.getElementById("title_"+tab_id).value+".txt";
			} else {
				var filename = "tab"+tab_id+"_text.txt";
			}
			var text = document.getElementById(tab_id).value;
			download(filename,text);
		}
		
		// if it's a JSON file
		if ("json" == filetype) {
            var filename = document.getElementById("export_filename").value;
            if(filename.length == 0){ filename = "default"}
			saveSADFace(filename, filetype);
		}
	}
	
	//if it's a load operation
	if ("load" == operation) {
		// if it's a txt file
		if ("txt" == filetype) {
			var files = document.getElementById("load"+tab_id).files;
			var file = files[0];
			var filename = file.name;
			document.getElementById("title_"+tab_id).innerText = filename;
			console.log(file.name);
			var reader = new FileReader();		
			reader.onload = function(e) {
				var content = reader.result;
				document.getElementById(tab_id).innerText = content;
				update_resource(tab_id, content, filename);
			}
			reader.readAsText(file);
		}
		// if it's a JSON file
		if ("json" == filetype) {
			var files = document.getElementById("loadJSON").files;
			var file = files[0];
			var reader = loadSADFace(file);
			reader.onload = function(e) {
				var result = reader.result;
				localStorage.setItem("state",result);
				loadJSON(result);
				var json = JSON.parse(result);
				remove_all_tabs();
				loadTabs(json.resources);
			}
		}
	}
}






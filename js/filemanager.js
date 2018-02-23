function filemanager(operation, filetype, text=null, filename=null, tab_id=null) 
{
	/*
	Write text from tab to file or does a SADFace save operation
	*/
	if ("save" == operation)
	{
		// if it's a txt file
		if ("txt" == filetype)
		{	
			download(filename,text);
		}
		
		// if it's a JSON file
		if ("json" == filetype)
		{
			saveSADFace(filename, filetype);
		}
	}
	
	//if it's a load operation
	if ("load" == operation)
	{
		// if it's a txt file
		if ("txt" == filetype)
		{
			if (document.getElementById(tab_id))
			{
				alert("Tab does not exist.")
			} else {
				var files = document.getElementById("load"+tab_id).files;
				var file = files[0];
				var reader = new FileReader();		
				reader.onload = function(e) {
					var fileContents = document.getElementById("textarea"+tab_id);
					fileContents.innerText = reader.result;
				}
			}
			reader.readAsText(file);
		}
		
		// if it's a JSON file
		if ("json" == filetype)
		{
			var files = document.getElementById("loadJSON").files;
			var file = files[0];
			var reader = loadSADFace(file);
			reader.onload = function(e) {
				console.log(reader.result);
				var cy = export_cytoscape(import_json(reader.result));
				localStorage.setItem("state",cy);
				loadJSON();
			}

		}
		
	}
}






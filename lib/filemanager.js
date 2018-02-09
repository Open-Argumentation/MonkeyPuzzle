var operation; // 0 for save, 1 for load
var file_type; //0 for txt, 1 for json, 2 to initialise diagram
var tab_id;	//0 if no tab required, else tab_id
var text;
var filename;

function filemanager(operation, file_type, tab_id) 
{
	//if it's a save operation
	if (operation === 0)
	{
		// if it's a txt file
		if (file_type === 0)
		{
			if (document.getElementById(tab_id))
			{
				alert("Tab does not exist.")
			} else {
				text = document.getElementById("textarea"+tab_id).value;
				filename = "tab"+tab_id+"_text.txt";
				
				download(filename,text);
			}
		}
		
		// if it's a JSON file
		if (file_type === 1)
		{
			if (localStorage.getItem('state') != 'null')
			{
				text = "{\"nodes\":"+localStorage.getItem('state')+"}"
				filename = "mangrove.json";
				
				download(filename,text);
			} else 
			{
				alert("No changes have been made to the diagram to save.");
			}
			
		}
	}
	
	//if it's a load operation
	if (operation === 1)
	{
		// if it's a txt file
		if (file_type === 0)
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
		if (file_type === 1)
		{
			var files = document.getElementById("loadJSON").files;
			var file = files[0];
			var reader = new FileReader();		
			reader.onload = function(e) {
				localStorage.setItem("state",reader.result);
				loadJSON();
			}
			reader.readAsText(file);
		}
		
	}
}

function download(filename, text) {
	console.log("Downloading "+filename);
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}






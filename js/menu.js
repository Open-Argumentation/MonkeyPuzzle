var slideout;

slideout = new Slideout( {
    "panel": document.getElementById("panel"),
    "menu": document.getElementById("menu"),
    "fx": "ease",
    "side": "right",
    "duration": 500,
    "padding": 256,
    "tolerance": 70
});

slideout.on("close", function() { cy.resize(); } );
slideout.on("open", function() { cy.resize(); } );

$(".toggle-button").click(function() {
    toggle_menu();
});

function download_sadface()
{
    filemanager('save','json',null)
}


function download_png()
{
    var filename = document.getElementById("export_filename").value;
    if(filename.length == 0){ filename = "default"}
    filename+=".png";
    
    var link = document.getElementById("download_png");
    link.download = filename;
}

function download_jpg()
{
    var filename = document.getElementById("export_filename").value;
    if(filename.length == 0){ filename = "default"}
    filename+=".jpg";
    
    var link = document.getElementById("download_jpg");
    link.download = filename;
}

function load_demo_argument()
{

    var demo_sadface_doc = "{\"analyst_email\":\"40170722@live.napier.ac.uk\",\"analyst_name\":\"Nathan Mair\",\"created\":\"2018-02-23T02:27:36\",\"edges\":[{\"id\":\"a1s1\",\"source_id\":\"a1\",\"target_id\":\"s1\"},{\"id\":\"a2s1\",\"source_id\":\"a2\",\"target_id\":\"s1\"},{\"id\":\"a3s2\",\"source_id\":\"a3\",\"target_id\":\"s2\"},{\"id\":\"s2a5\",\"source_id\":\"s2\",\"target_id\":\"a5\"},{\"id\":\"s1a4\",\"source_id\":\"s1\",\"target_id\":\"a4\"},{\"id\":\"a4s2\",\"source_id\":\"a4\",\"target_id\":\"s2\"}],\"edited\":\"2018-02-23T02:27:36\",\"id\":\"94a975db-25ae-4d25-93cc-1c07c932e2f9\",\"metadata\":{},\"nodes\":[{\"id\":\"a1\",\"metadata\":{},\"sources\":[],\"text\":\"Every person is going to die\",\"type\":\"atom\"},{\"id\":\"a2\",\"metadata\":{},\"sources\":[],\"text\":\"You are a person\",\"type\":\"atom\"},{\"id\":\"a3\",\"metadata\":{\"test\":\"test\"},\"sources\":[],\"text\":\"If you are going to die then you should treasure every moment\",\"type\":\"atom\"},{\"id\":\"a4\",\"metadata\":{},\"sources\":[],\"text\":\"You are going to die\",\"type\":\"atom\"},{\"id\":\"a5\",\"metadata\":{},\"sources\":[],\"text\":\"You should treasure every moment\",\"type\":\"atom\"},{\"id\":\"s1\",\"name\":\"Default Support\",\"type\":\"scheme\"},{\"id\":\"s2\",\"name\":\"Default Support\",\"type\":\"scheme\"}],\"resources\": []}";

    localStorage.setItem("state",demo_sadface_doc);
    cy_data = export_cytoscape(import_json(demo_sadface_doc));
    initCytoscape();
}

function toggle_menu()
{
    if (slideout.isOpen()) { slideout.close(); }
    else { slideout.open(); }
    cy.center();
    cy.resize();
}

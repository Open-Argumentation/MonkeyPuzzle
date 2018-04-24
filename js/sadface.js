var sd = {};

//values from defaults.cfg
var a_name = "A user";
var a_email = "user@email.address";
var f_name = "data";

function add_argument(con_text, prem_text, con_id, prem_id) {
    /*
    Syntactic sugar to create an argument structure from a set of texts.
    Given a conclusion text & a list of premise texts, create an intermediate,
    default "support" scheme.

    This makes it easier to build a SADFace document without manually creating
    and organising individual nodes.

    Returns an argument dict, e.g.

    {
        "conclusion": atom,
        "scheme": atom,
        "premises": [atom(s)]
    }

    Returns: a dict
    */
    if(((con_text !== null && con_text !== undefined) || (con_id !== null && con_id !== undefined)) && ((prem_text !== null && prem_text !== undefined) || (prem_id !== null && prem_id !== undefined))) {
        
        var c;
        var s;
        var p_list = [];
        var atom;
        var arg = {};
        
        if(con_text !== null) {
            c = add_atom(con_text);
        } else {
            c = get_atom(con_id);
        }
        s = add_scheme("support");
        try  {
            add_edge(s.id, c.id);
        }
        catch(ex) {
            console.log(ex);
            throw ("Could not create new argument");
        }
        
        
        if(prem_text !== null) {
            prem_text.forEach(function(text) {
                atom = add_atom(text);
                p_list.push(atom.id);
                try {
                    add_edge(atom.id, s.id);
                }
                catch (ex) {
                    console.log(ex);
                    throw ("Could not create new argument");
                }
            });
        }
        if(prem_id !== null) {
            prem_id.forEach(function(atom_id) {
                atom = get_atom(atom_id);
                p_list.push(atom.id);
                try {
                    add_edge(atom.id, s.id);
                }
                catch (ex) {
                    console.log(ex);
                    throw ("Could not create new argument");
                } 
            });
        }
        arg = {"conclusion":c, "scheme":s, "premises":p_list};
        return arg;
    }
    return;
}

function add_conflict(arg_text, arg_id, conflict_text, conflict_id) {
    /*
        Conflicts play an important role in arguments. We depict conflict
    through the use of schemes that represent the conflict relationship. This
    function will instantiate a conflict scheme between two nodes (either
    pre-existing & identifed by node IDs or created from supplied texts, or a
    mixture of the two).

    Returns a conflict dict, e.g.

    {
        "argument": atom,
        "scheme": atom,
        "conflict": atom
    }
    (where the scheme just happens to depict a conflict)

    Returns: a dict
    */
    if(((arg_text !== null && arg_text !== undefined) || (arg_id !== null && arg_id !== undefined )) && ((conflict_text !== null && conflict_id !== null) || (conflict_text !== undefined && conflict_id !== undefined))) {
        
        var c;
        var s;
        var a;
        var arg = {};
        
        if (arg_text!==null || arg_text !==undefined) {
            a = add_atom(arg_text);
        } else {
            a = get_atom(arg_id);
        }
        s = add_scheme("conflict");
        
        try {
            add_edge(s.id, a.id);
        }
        catch(ex) {
            console.log(ex);
            throw ("Could not create new argument");
        }
        
        if (conflict_text !== null || conflict_text !== undefined) {
            c = add_atom(conflict_text);
        } else {
            c = get_atom(conflict_id);
        }
        
        try {
            add_edge(c.id, s.id);
        }
        catch(ex) {
            console.log(ex);
            throw("Could not create new argument");
        }
        
        arg = {"argument":a, "scheme":s, "conflict":c};
        return arg;
    }
    return;
}

function add_edge(source_id, target_id) {
    /*
    Given a source atom ID & a target atom ID, create an 
    edge linking the two and add it to the sadface doc,
    "sd" & return the dict representing the edge. If
    either of source or target IDs is invalid then an
    exception is raised.

    Returns: a dict 
    */
    if (source_id && target_id) {
        if ((get_node(source_id) !== null) && (get_node(target_id) !== null)) {
            var edge = new_edge(source_id, target_id);
            sd.edges.push(edge);
            return edge;
        }
        throw("Could not create new edge between: " +source_id+" & "+target_id);
    }
}

function add_atom(text) {
    /*    
    Create a new argument atom using the supplied text

    Returns: the new atom dict
    */
    if (text) {
        var atom = new_atom(text);
        sd.nodes.push(atom);
        return atom;
    }
}

function add_atom_metadata(atom_id, key, value) {
    /*
    Add metadata, a key:value pair to the atom dict identified
    by the supplied atom ID.
    */
    if (atom_id && key && value) {
        sd.nodes.forEach(function(node) {
            if("atom" === node.type) {
                if (atom_id === node.id) {
                    node.metadata[key] = value;
                }
            }
        });
    }
}

function add_resource(content) {
    /*
    Create a new resource dict using the supplied content string
    then add to the resourses list of the sadface doc

    Returns: the new resource dict
    */
    if (content) {
        var res = new_resource(content);
        sd.resources.push(res);
        return res;
    }
}

function add_resource_metadata(resource_id, key, value) {
    /*
    Add metadata, a key:value pair to the resource dict identified
    by the supplied atom ID.    
    */
    if (resource_id && key && value) {
        sd.resources.forEach(function(res) {
            if(res.id === resource_id) {
                res.metadata[key] = value;
            }
        });
    }
}

function add_sadface_metadata(key, value) {
    /*
    Add metadata, a key:value pair to the base sadface doc
    */
    if (key && value) {
        sd.metadata[key] = value;
    }
}

function add_scheme(name) {
    /*
    Add a new scheme node dict to the sadface document. The scheme type
    is identified by the supplied name

    Returns: The new scheme dict
    */
    if (name) {
        var scheme = new_scheme(name);
        sd.nodes.push(scheme);
        return scheme;
    }
}

function add_source(atom_id, resource_id, text, offset, length) {
    /*
    Add a new source dict to the atom identified by the supplied
    atom ID. The new source refers to the an existing resource that
    is identified by the supplied resource ID. The source identifies
    text string in the resource dict that it references as well as
    the offset & length of the text from the beginning of the resource

    Returns: The new source dict
    */
    if (atom_id && resource_id && text !== null && offset !== null && length !== null && text !== undefined && offset !== undefined && length !== undefined) {
        var source = new_source(resource_id, text, offset, length);
        sd.nodes.forEach(function(node) {
            if ("atom" === node.type) {
                if (atom_id === node.id) {
                    node.sources.push(source);
                }
            }
        });
        return source;
    }
}

function delete_atom(atom_id) {
    /*
    Remove the atom from the sadface document identified by the
    supplied atom ID
    */
    if (atom_id) {
        var atom = get_atom(atom_id);
        if (atom !== null && atom !== undefined) {
            var size = Object.keys(sd.nodes).length;
            for (var i = 0; i < size; ++i) {
                if (sd.nodes[i].id === atom.id) {
                    delete sd.nodes[i];
                    sd.nodes = remove_falsy(sd.nodes);
                    return;
                }
            }
        }
    }
}

function delete_edge(edge_id)
{
    /*
    Remove the edge from the sadface document identified by the
    supplied edge ID
    */
    if (edge_id) {
        var del_edge = get_edge(edge_id);
        var size = Object.keys(sd.edges).length;
        for (var i = 0; i < size; ++i) {
            if (sd.edges[i].id === del_edge.id) {
                delete sd.edges[i];
                sd.edges = remove_falsy(sd.edges);
                return;
            }
        }
    }
}

function delete_source(atom_id, resource_id) {
    /*
    Remove a source from the atom identified by the
    supplied atom ID & resource ID respectively
    */
    if (atom_id && resource_id) {
        var source = get_source(atom_id, resource_id);
        var size = Object.keys(sd.nodes).length;
        for (var i = 0; i < size; ++i) {
            if (sd.nodes[i].atom.sources.resource_id === source.id) {
                delete sd.nodes[i].atom_id.sources.resource_id;
                sd.nodes[i].atom_id.sources = remove_falsy(sd.nodes);
                return;
            }
        }
    }
}

function delete_resource(resource_id) {
    /*
    Remove the resource from the sadface document identified by the
    supplied resource ID
    */
    if (resource_id) {
        var resource = get_resource(resource_id);
        if (resource !== null && resource !== undefined) {
            var size = Object.keys(sd.resources).length;
            for (var i = 0; i < size; ++i) {
                if (sd.resources[i].id === resource.id) {
                    delete sd.resources[i];
                    sd.resources = remove_falsy(sd.resources);
                    return;
                } 
            }
        }
    }
}
function delete_scheme(scheme_id) {
    /*
    Remove the schemee from the sadface document identified by the
    supplied scheme ID
    */
    if (scheme_id) {
        var scheme = get_scheme(scheme_id);
        if (scheme !== null && scheme !== undefined) {
            var size = Object.keys(sd.nodes).length;
            for (var i = 0; i < size; ++i) {
                if (sd.nodes[i].id === scheme.id) {
                    delete sd.nodes[i];
                    sd.nodes = remove_falsy(sd.nodes);
                    return;
                } 
            }
        }
    }
}

const remove_falsy = (obj) => {
    /*
    The delete function in javascript tends to replace deleted objects with
    null values. This function removes those from an object after something within it is deleted.
    */
    if (obj) {
        var newObj = [];
        Object.keys(obj).forEach((prop) => {
            if (obj[prop]) { 
                newObj.push(obj[prop]); 
            }
        });
        return newObj;
    } else {
        return obj;
    }
};

function export_cytoscape(sadface) {
    /*
    Cytoscape.js is a useful graph visualisation library for Javascript. However
    it uses some slightly different keynames and includes description of visual
    elements, useful to Cytoscape"s visualisation, but having no place in SADFace.

    Both nodes & edges in a Cytoscape graph are collated together into a single
    elements object so we need to do that to the SADFace nodes & edges. Furthermore,
    each node and edge object must contain a data object. After that conversion is
    a relatively straightforward mapping:

    EDGES
        id -> id
        source_id -> source
        target_id -> target

        e.g. 
        {
            "data": {
                "source": "a1",
                "id": "a1s1",
                "target": "s1"
            }
        }

    NODES - ATOMS    
        id -> id
        type -> type
        text -> content
        + "classes":"atom-label"
        + "typeshape":"roundrectangle"

        e.g.
        {
            "classes": "atom-label",
            "data": {
                "content": "Every person is going to die",
                "type": "atom",
                "id": "a1",
                "typeshape": "roundrectangle"
            }
        }


    NODES - SCHEMES
        id -> id
        type -> type
        name -> content
        + "classes":"scheme-label"
        + "typeshape":"diamond"
        
        e.g.
        {
            "classes": "scheme-label",
            "data": {
                "content": "Default\nSupport",
                "type": "scheme",
                "id": "s1",
                "typeshape": "diamond"
            }
        }

    */
    //allows export_cytoscape to take a value such as a loaded sadface file and return a cytoscape visualisation
    if (sadface === null || sadface === undefined)
    {
        sadface = sd;
    }
    var cy = {};
    cy.nodes = [];
    cy.edges = [];

    sadface.edges.forEach(function(edge) {
        var e = {};
        e.data = {};
        e.data.id = edge.id;
        e.data.source = edge.source_id;
        e.data.target = edge.target_id;
        cy.edges.push(e);
    });
    
    sadface.nodes.forEach(function(node) {
        var n = {};
        n.data = {};
        n.data.id = node.id;
        n.data.type = node.type;

        if (n.data.type === "atom") {
            n.classes = "atom-label";
            n.data.typeshape = "roundrectangle";
            n.data.content = node.text;
        } else {
            n.classes = "scheme-label";
            n.data.typeshape = "diamond";
            n.data.content = node.name;
        }
        
        cy.nodes.push(n);
    });
    return JSON.stringify(cy);
}

function export_dot() {
    /*
    Exports a subset of SADFace to the DOT graph description language

    Returns: String-encoded DOT document
    */
    var max_length = 25;
    var edge_str = " -> ";
    var dot = "digraph SADFace {";
    dot += "node [style=\"filled\"]";

    sd.nodes.forEach(function(node) {
        var line;
        if (node.indexof("text")) {
            var txt = node.text;
            if (txt.length > max_length) {
                txt = "\r\n".join(textwrap(txt,max_length));
            }
            line = "\"{}\"".format(node.id) + "[label=\"" + txt + "\"]" + " [shape=box, style=diamond];\n";
            dot += line;
        } else if (node.indexof("name")) {
            line = "\"{}\"".format(node.id) + " [label=\"" + node.name + "\"]" + " [shape=diamond];\n";
            dot += line;
        }
    });
    
    sd.edges.forEach(function(edge) {
        var source = get_node(edge.source_id);
        var target = get_node(edge.target_id);
        
        if("atom" === source.type) {
            dot += "\"{}\"".format(source.id);
        } else if ("scheme" === source.type){
            dot += "\"{}\"".format(source.id);
        }
        
        dot += edge_str;
        
        if("atom" === target.type) {
            dot += "\"{}\"".format(target.id);
        } else if ("scheme" === target.type){
            dot += "\"{}\"".format(target.id);
        }
        
        dot += ";\n";    
    });
    dot += "}";
}

function export_json() {
    /*
    Dump the current sadface document to a JSON string

    Returns: String-encoded JSON
    */
    return JSON.stringify(sd);
}

function get_atom(atom_id) {
    /*
    Retrieve the atom dict identified by the supplied atom ID

    Returns: An atom dict
    */
    console.log(atom_id);
    if (atom_id) {
        var node;
        var size = Object.keys(sd.nodes).length;
        for (var i = 0; i < size; ++i) {
            node = sd.nodes[i];
            if (node.id === atom_id) {
                return node;
            } 
        }
    }
}

function get_edge(edge_id) {
    /*
    Retrieve the edge dict identified by the supplied edge ID

    Returns: An edge dict
    */
    if (edge_id) {
        var edge;
        var size = Object.keys(sd.edges).length;
        for (var i = 0; i < size; ++i) {
            edge = sd.edges[i];
            if (edge.id === edge_id) {
                return edge;
            } 
        }
    }
}

function get_node(node_id) {
    /*
    Given a node"s ID but no indication of node type, return the node if 
    it exists or else indicate that it doesn"t to the caller.

    Returns: A node dict or None
    */
    if (node_id) {
        var node;
        var size = Object.keys(sd.nodes).length;
        for (var i = 0; i < size; ++i) {
            node = sd.nodes[i];
            if (node.id === node_id) {
                return node;
            } 
        }
    }
}

function get_resource(resource_id) {
    /*
    Retrieve the resource dict identified by the supplied resource ID

    Returns: An resource dict
    */
    if (resource_id) {
        var resource;
        var size = Object.keys(sd.resources).length;
        for (var i = 0; i < size; ++i) {
            resource = sd.resources[i];
            if (resource.id === resource_id) {
                return resource;
            } 
        }
    }
}

function get_scheme(scheme_id) {
    /*
    Retrieve the scheme dict identified by the supplied scheme ID

    Returns: A scheme dict
    */
    if (scheme_id) {
        var node;
        var size = Object.keys(sd.nodes).length;
        for (var i = 0; i < size; ++i) {
            node = sd.nodes[i];
            if (node.id === scheme_id) {
                return node;
            } 
        }
    }
}

//get source returns an array of two values since Javascript doesn"t support multiple return values
function get_source(atom_id, resource_id) {
    /*
    Retrieve the source dict identified by the supplied source ID

    Returns: An source dict
    */
    if (atom_id && resource_id) {
        var sourced = [];
        var atom = get_atom(atom_id);
        var source;
        var size = Object.keys(atom.sources).length;
        for (var i = 0; i < size; ++i) {
            source = atom.sources[i];
            if (source.resource_id === resource_id) {
                sourced[0] = atom;
                sourced[1] = source;
                return sourced;
            } 
        }
    }
}

function import_json(json_string) {
    /*
    Take a string-encoded JSON document and loads it into a dict

    Returns: the loaded dict
    */
    if (json_string) {
        sd = JSON.parse(json_string);
        return sd;
    }
}

// the try/catch in sadface.py is not needed as javascript cannot read local files without making an http request (which means app can"t be run without server), cfg values have been hardcoded
function init() {
    /*
    Reads the config file from the supplied location then uses the data
    contained therein to personalise a new SADFace document

    Returns: A dict representing the new SADFace document
    */
    return new_sadface();
}

function new_atom(text) {
    /*
    Creates a new SADFace atom node (dict) using the supplied text

    Returns: A dict representing the new SADFace atom
    */
    if (text) {
        var new_atom = {"id":new_uuid(), "type":"atom", "text":text, "sources":[], "metadata":{}};
        return new_atom;
    }
}

function new_edge(source_id, target_id) {
    /*
    Creates & returns a new edge dict using the supplied source & 
    target IDs

    Returns: A dict representing the new edge
    */
    if (source_id && target_id) {
        var new_edge = {"id":new_uuid(), "source_id":source_id, "target_id":target_id};
        return new_edge;
    }
}

function new_sadface() {
    /*
    Creates & returns a new SADFace document

    Returns: A dict representing the new SADFace document
    */
    var new_doc = {"id":new_uuid(), "analyst_name":a_name, "analyst_email":a_email, "created":now(), "edited":now(), "metadata":{}, "resources":[], "nodes":[], "edges":[]};
    return new_doc;
}

function new_resource(content) {
    /*
    Given the supplied content (String), create a new resource dict

    The arguments that SADFace describes are either constructed directly in a tool that writes
    them to this format, or else are sourced from elsewhere, e.g. an argumentative text or
    webpage, or else perhaps another medium, such as audio or video. Currently SADFace supports
    textual resources which are stored in the content key. Optionally a 
        "url":"some web location"
    pair can be added to the metadata to indicate a specific web location. Alternatively:
        "doi":"digital object identifier" - resolvable by dx.doi.org
        "magnet-link":"a torrent file"
        "isbn":"for books"
    Metadata may also store additional bibliographic or referencing/citation information
    as defined in bibtex formats.

    Returns: A dict representing the new SADFace resource
    */
    if (content) {
        var new_resource = {"id":new_uuid(), "content":content, "type":"text", "metadata":{}};
        return new_resource;
    }
}

function new_scheme(name) {
    /*
    Create a new SADFace scheme (Python dict) using the supplied scheme name. The scheme
    name should refer to an existing scheme from a known schemeset

    Returns: A Python dict representing the new SADFace scheme
    */
    if (name) {
        var new_scheme = {"id":new_uuid(), "type":"scheme", "name":name};
        return new_scheme;
    }
}

function new_source(resource_id, text, offset, length) {
    /*
    Create a new SADFace source (Python dict) using the supplied resource ID (a source always
    refers to an existing resource object) and identifying a section of text in the resource 
    as well as an offset & segment length for locating the text in the original resource.

    As the resource object is enhanced to account for newer "types" of resource, so the
    source object must be enhanced to keep track and enable sources to index sub-parts of
    resources.

    Returns: A Python dict representing the new SADFace source
    */
    if (resource_id && text !== null && text !== undefined && offset !== null && offset !== undefined && length !== null && length !== undefined) {
        var new_source = {"resource_id":resource_id, "text":text, "offset":offset, "length":length};
        return new_source;
    }
}

//uuid function from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function new_uuid() {
    /*
    Utility method to generate a new universally unique ID. Used througout to uniquely
    identify various items such as atoms, schemes, resources, & edges

    Returns: A string
    */
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function now() {
    /*
    Utility method to produce timestamps in ISO format without the microsecond
    portion, e.g. 2017-07-05T17:21:11

    Returns: A String
    */
    var d = new Date();
    //removes microseconds and Z from the ISO string
    return d.toISOString().split(".")[0];
}

function prettyprint(doc) {
    /*
    Print nicely formatted output of the passed in string or
    otherwise the SADFace document encoded as a String

    Returns: A String
    */
    var string;
    if (doc !== null || doc !== undefined) {
        string = sd;
    } else {
        string = doc;
    }
    return JSON.stringify(string, null, 2);
}

function saveSADFace(filename, filetype) {
    /*
    Write the prettyprinted SADFace document to a JSON file and download
    */
    var f = filename;
    var text;
    if (f === null || f === undefined) {
        f = f_name;
    }
    
    if ("dot" === filetype) {
        f += ".dot";
        text = export_dot();
    } else if ("cytoscape" === filetype) {
        f += ".json";
        text = prettyprint(JSON.parse(export_cytoscape(null)));
    } else {
        f += ".json";
        text = JSON.stringify(sd, null, 2);
    }
    download(f, text);
}

function loadSADFace(file) {
    /*
    Create a read for a JSON file
    */
    if (file) {
        var reader = new FileReader();    
        reader.readAsText(file);
        
        return reader;
    }
}

function download(filename, text) {
    /*
    Downloads a file given its filename and its text using utf-8 charset
    */
    console.log("Downloading "+filename);
    var outfile = document.createElement("a");
    outfile.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    outfile.setAttribute("download", filename);

    outfile.style.display = "none";
    document.body.appendChild(outfile);

    outfile.click();

    document.body.removeChild(outfile);
}

function update() {
    /*
    Updates the last edited timestamp for the SADFace doc to now
    */
    sd.edited = now();
}

function update_analyst(analyst) {
    /*
    Updates the name of the argument analyst in the SADFace doc to the supplied name
    */
    if (analyst) {
        sd.analyst = analyst;
    }
}

function update_atom_text(atom_id, new_text) {
    /* 
    An atoms text key:value pair is the canonical representation of a portion of text 
    that exists in an argument. This should be updatable so that the overall document 
    makes sense. Links to original source texts are maintained via the source list 
    which indexes original text portions of linked resources.

    Returns: The updated atom dict
    */
    if (atom_id && new_text) {
        var atom = get_atom(atom_id);
        if (atom !== null || atom !== undefined) {
            atom.text = new_text;
            return atom;
        } else {
            throw ("Could not update the text value for atom: "+atom_id);
        }
    }
}

function update_atom_metadata(atom_id, metadata) {
    /*
    Given an atoms ID and a dict object containing its metadata, updates the atom with
    new set of metadata.
    
    Returns: The updated atom dict
    */
    if (atom_id && metadata) {
        var atom = get_atom(atom_id);
        if (atom !== null || atom !== undefined) {
            atom.metadata = metadata;
            return atom;
        } else {
            throw ("Could not update the metadata for atom: "+atom_id);
        }
    }
}

function update_created(timestamp) {
    /*
        Updates the creation timestamp for the SADFace document to the supplied timestamp.
    This can be useful when moving analysed argument data between formats whilst
    maintaining original metadata.
    */
    if (timestamp) {
        sd.timestamp = timestamp;
    }
}

function update_id(id) {
    /*
    Update the SADFace document ID to match the supplied ID. This can be useful when 
    moving analysed argument data between formats whilst maintaining original metadata.
    */
    if (id) {
        sd.id = id;
    }
}

function update_edited(timestamp) {
    /*
    Update the last edited timestamp for the SADFace doc to match the supplied
    timestamp. This can be useful when moving analysed argument data between formats 
    whilst maintaining original metadata.
    */
    if (timestamp) {
        sd.edited = timestamp;
    }
}

function update_scheme(scheme_id, scheme_name) {
    /*
    Given an ID for an existing scheme node, update the name associated with it and return the scheme node.
    
    Returns: Updated scheme dict
    */
    if (scheme_id && scheme_name) {
        var scheme = get_scheme(scheme_id);
        if (scheme !== null || scheme !== undefined) {
            scheme.name = scheme_name;
            return scheme;
        } else {
            throw ("Could not update the name of scheme: "+scheme_id);
        }
    }
}

function update_resource(resource_id, content, title) {
    /*
    Given an ID for an existing resource, update the content and metadata of the resource.
    Updates the resource in sd;
    */
    if (resource_id && (content || title)) {
        console.log("hello");
        var resource = get_resource(resource_id);
        if (resource !== null && resource !== undefined) {
            if (content !== null && content !== undefined) {
                resource.content = content;
            }
            if (title !== null && title !== undefined) {
                resource.metadata.title = title;
            }
            sd.resources.forEach((res) => {
                if(res.id === resource_id) {
                    res = resource;
                }
            });
        } else {
            throw ("Could not update the resource: "+resource_id);
        }
    }
}

function get_sd() {
    /*
    Function to get the current state of SD
    
    Returns: Current state of SD
    */
    return sd;
}


String.prototype.format = () => {
  var i = 0, args = arguments;
  return this.replace(/{}/g, () => {
    return typeof args[i] !== "undefined" ? args[i++] : "";
  });
};

//textwrap function from https://gist.github.com/bgrayburn/44fa018b94222590f618
function textwrap (long_string, max_char){
    if (long_string && max_char) {
        var sum_length_of_words = (word_array) => {
            var out = 0;
            if (word_array.length!==0){
              for (var i=0; i<word_array.length; i++){
                var word = word_array[i];
                out = out + word.length;
              }
            }
            return out;
        };

        var split_out = [[]];
        var split_string = long_string.split(" ");
        for (var i=0; i<split_string.length; i++){
            var word = split_string[i];
            
            if ((sum_length_of_words(split_out[split_out.length-1]) + word.length) > max_char){
              split_out = split_out.concat([[]]);
            }
            
            split_out[split_out.length-1] = split_out[split_out.length-1].concat(word);
        }
      
        for (i=0; i<split_out.length; i++){
            split_out[i] = split_out[i].join(" ");
        }
        return split_out;
    }
}
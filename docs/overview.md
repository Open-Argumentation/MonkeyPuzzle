# Overview #

MonkeyPuzzle is designed to:

- Be a test-bed for argument analysis and construction techniques.
- Support analysis of argument contained in multiple existing resources.
- Support argument construction, for example, to work out the arguments visually before embarking upon writing a persuasive or deliberative piece.
- Support a scalable visualisation mechanism and associated infrastructure that supports very large argument analyses.
- Provide a permanent, free, and open-source (GPL v3) resource for argument analysis and construction.
- Provide flexible usage and deployment options so that analyst and end-user privacy can be preserved.

When you first load MonkeyPuzzle you will be confronted with a blank seeming page (with a hamburger icon in the top right corner). Don't worry, this is as a result of our expert oriented design aesthetic in which we try to maimis the space available for you to work with your visualisation of argument strucure. The blank page is the visualisation pane.

The main points of difference between MonkeyPuzzle and other argument analysis tools are

1. Multiple resource analysis
2. Sub-argument labelling
3.  offline and online usage and (self-)hosting
4. Export of argument analyses to a well documented format (SADFace) which is supported by additional libraries for further analysis and scripting
5. Hugely scalable underlying visualisation library


MonkeyPuzzle has three core interface elements, the visualistion pane, the resources pane, and the menu pane. 

## The visualisation pane ##

This is where the argument visualisation is constructed. The visualisation is graph based, so your visualisation is constructed from combinations of nodes and edges. Nodes are currently of three basic types:

- **Atoms** are nodes that represent the content of a constituent element of an argument, usually a sentence that acts within the argument, for example as a premise, or conclusion, of an argument. Atoms have content, which is a single string. Atom content is of arbitrary length but most premises and conclusions appear to have a natural upper bound on length akin to the length of an average sentence that makes a single, clear statement. Atoms can be created in three ways, by loading an existing SADFace document from storage, by right clicking upon the visualisation and choosing "add atom" or by selecting text within a resource in the resource pane and either dragging the selection onto the visualisation or else clicking the puzzle piece button in the resource pane toolbar.

- **Schemes** are nodes that essentially represent the type of an argument. That is, we assume that there are many ways to reason and to infer conclusions from premises, but that these manifest in terms of various different but recognisable patterns. Argumentation schemes, therefore, attempt to schematically capture these differet but stereotypical patterns of reasoning. A single argument is thus a collection of connected nodes within the graph including a single scheme node and the set of atoms that the scheme nodes is immediately connected to. For example, a scheme node might have multiple incoming connections from atoms that, in the context of this scheme node, enact the role of premises, and an outgoing edge that connects to an atom that enacts the role of conclusion. Note that any given atom can be connected to multiple different schemes and thus can exist within multiple distinct arguments at any given time. There are multiple schemes available and the research literature names several hundred distinct argumentation schemes. In addition to the default support scheme, and optional conflict scheme, there are an additional 20 core named argumentation schemes available from the 'change scheme' modal (right click on a scheme and select change scheme to activate this modal).

- **Groups** are meta-level nodes that have no semantic bearing on the content of the argument graph. Instead they are a human oriented mechanism for labelling identifiable and distinguishable arguments within the greater knowledge domain represented by the wider graph. A good way to think of the group node is as a cartographic element that helps us to navigate the larger map, and to dinstinguish identifiable parts of it. Many real world argumentation domains contains specific sub-arguments that are recognisable and represent navigational shortcuts or referrants during discussion; groups do the same thing in a MonkeyPuzzle visualisation. 

Edges are directed, conveying some form of relationship between the nodes that the edge connects. Edges only ever connect a single pair of nodes in which one is the source node and the other is the destination node. Source and destination are determined based upon the direction of the edge. Edges themselves don't carry any information or labels about the 'type' of relationship that the edge represents. Instead an edge 'type' is inferred from the nature of the nodes that are connected. Edges only connect nodes of distinct types, for example, there is a restriction on connecting atoms directly to other atoms. Atoms can only connect to each other via an intermediate scheme node. This is because the type of relationship between a pair of directly connected atoms cannot be generally inferred but an intermediate scheme node provides a framework for the inference.

Note that functionality within the visualisation pane is heavily dependent upon underlying functionality provided by SADFace. As SADFace develops support for new features, for example, dialogue representation and analysis, so too will MonkeyPuzzle provide an interface to exploit them.

## Resource Pane ## 

A key aspect of MonkeyPuzzle, and it's main differentiator for competing tools, is the support for analysis of multiple resources. It became clear whilst analysing real world domains of conflict that all of the arguments were rarely enveloped within a single source text, and that much of our interest in analysis was in examining different approaches to the same argument, and also in assembling multiple analyses, from multiple sources, into a single, cohesive analysis of the domain of argument. Thus the resource pane is our core user interface element that supports multiple resources. Currently resources are text file that are loaded manually, each into their own individual tab within the resource pane. There is no upper limit set upon how many resources can be loaded but a practical bound is probably imposed by the users own computational equipment, the size of their screen and the amount of RAM and CPU available.

Note that the divider between the visualisation and resource panes is grabbable and can be moved to provide different amounts of space to the visualisation and resource panes dependent upon user need. This is adjustable because during a single analysis session, time might be devoted to different tasks, for example, initially focussing upon marking up and extracting atoms from raw resource data, before moving to focus upon drawing edges between those atoms in the visualisation.

## Menu Pane ## 

Provides access to less frequently used MonkeyPuzzle functionality for importing and exporting data, and for resetting the application. As a result, the default status for the menu pane is for it to be toggled to the hidden position.

The core elements are supplemented by a variety of modal elements for doing various specific tasks. Let's try one out right now. If you hit the 'h' key on your keyboard then you will the see the help modal which displays the various keyboard shortcuts available.


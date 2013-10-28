ngraph.traverse
===============

I'm trying to come up with easy way to traverse graphs, this is all very experimental.

[![build status](https://secure.travis-ci.org/anvaka/ngraph.traverse.png)](http://travis-ci.org/anvaka/ngraph.traverse)
Usage
=====

``` js
var traverseNodes = require('ngraph.traverse').nodes;

// Let's say `graph' is a graph. How to traverse all nodes?
traverseNodes(graph)
  .forEach(function (node) { /* node is here */ });
  
// How all adjacent nodes of `startNodeId'?
var children = traverseNodes(graph)
  .neighbors(startNodeId)
  .forEach(function (node) { /* node is here */ });

```

Traversal does not start until you call `forEach()` method. This allows you to delay computation.

You can also compose results of previous traversal. E.g. How to visit all neighbors of children from example above?

``` js
// All grandchildren?
traverseNodes(graph)
  .neghbors(children)
  .forEach(function(node) { /* node is here */ });
```

To traverse links:

``` js
var traverseLinks = require('ngraph.traverse').links;

// all links in graph:
traverseLinks(graph)
  .forEach(function (link) { /* link is here */ });

// All outgoing links from node:
traverseLinks(graph)
  .from(startNodeId)
  .forEach(function (link) { /* link is here */ });
    
// All incoming links:
traverseLinks(graph)
  .to(endNodeId)
  .forEach(function (link) { /* link is here */ });

// If your links has properties on them:
graph.addLink(0, 1, 'Lu');
// You can traverse only those links:
traverseLinks(graph)
  .where('Lu') 
  .forEach(function (link) { /* link is here */ });
  
// This is equivelent to:
traverseLinks(graph)
  .where(function (link) { return link.data === 'Lu'; } ) 
  .forEach(function (link) { /* link is here */ });
```

You can traverse from to sets too:
``` js
// Traverse all links from nodes with ids 1, 2, 3:
traverseLinks(graph)
  .from([1, 2, 3])
  .forEach(function (link) { /* link is here */ });

// You can use traversers too:
var children = traverseNodes(graph).neighbors(startNodeId);

// get all links to children:
links.from(startNodeId).to(children).forEach(function(link) { /* .. */ });

// get all links to grandchildren:
var grandChildren = traverseNodes(graph).neghbors(children);
links.from(children).to(grandChildren).forEach(function(link) { /* .. */ });
```

License
=======
BSD 3-Clause 

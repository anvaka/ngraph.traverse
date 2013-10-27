var addFilterForSet = require('./utils').addFilterForSet;

module.exports = function(graph) {
  if (typeof graph === 'undefined') {
    throw new Error('graph cannot be null in nodes traverser');
  }
  return new NodeIterator({}, graph);
};

function NodeIterator(filters, graph) {
  this.filters = filters;
  this.graph = graph;
}

NodeIterator.prototype.neighbors = function(nodeId) {
  var filters = {};
  addFilterForSet(filters, 'neighborsFrom', nodeId);

  return new NodeIterator(filters, this.graph);
};

NodeIterator.prototype.forEach = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error('callback is expected to be a function');
  }
  var getIds = this.filters.getIds;
  var neighborsFrom = this.filters.neighborsFrom;
  var graph = this.graph;

  var nodes = [], i;

  if (typeof neighborsFrom === 'function') {
    neighborsFrom = neighborsFrom();
  }
  if (typeof neighborsFrom !== 'undefined') {
    var deduper = {};
    var addNode = function(node) { deduper[node.id] = node; }

    for (i = 0; i < neighborsFrom.length; ++i) {
      graph.forEachLinkedNode(neighborsFrom[i], addNode, true);
    }
    for (var nodeId in deduper) {
      if (deduper.hasOwnProperty(nodeId)) {
        nodes.push(deduper[nodeId]);
      }
    }
  } else {
    graph.forEachNode(function (node) {
      nodes.push(node);
    });
  }

  for (i = 0; i < nodes.length; ++i) {
    callback(nodes[i]);
  }
  return this;
};


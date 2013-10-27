var isArray = require('./utils').isArray;

module.exports = function(graph) {
  return function() {
    return new NodeIterator({}, graph);
  };
};

function NodeIterator(filters, graph) {
  this.filters = filters;
  this.graph = graph;
}

NodeIterator.prototype.neighbors = function(nodeId) {
  if (isArray(nodeId)) {
    return new NodeIterator({ neighborsFrom: nodeId }, this.graph);
  } else if (nodeId && typeof nodeId.forEach === 'function') {
    return new NodeIterator( { getIds: createDelayedIdGetter(nodeId)}, this.graph);
  }

  return new NodeIterator({ neighborsFrom: [nodeId] }, this.graph);
};

NodeIterator.prototype.forEach = function (callback) {
  if (typeof callback !== 'function') {
    throw new Error('callback is expected to be a function');
  }
  var getIds = this.filters.getIds;
  var neighborsFrom = this.filters.neighborsFrom;
  var graph = this.graph;

  var nodes = [], i;

  if (typeof getIds === 'function') {
    neighborsFrom = getIds();
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

/**
 * Creates a function which retrieves (node|link) ids in future.
 */
function createDelayedIdGetter(set) {
  return function getNodeIds() {
    var elementIds = [];
    set.forEach(function (element) { elementIds.push(element.id); });
    return elementIds;
  };
}

var isArray = require('./utils').isArray;

module.exports = function(graph) {
  return function () {
    var neighborsFrom;
    var filters = {
      neighbors: function (nodeId) {
        if (typeof nodeId === 'undefined') {
          neighborsFrom = nodeId;
        } else if (isArray(nodeId)) {
          neighborsFrom = nodeId;
        } else {
          neighborsFrom = [nodeId];
        }
        return filters;
      }
    };

    filters.forEach = function (callback) {
      if (typeof callback !== 'function') {
        throw new Error('callback is expected to be a function');
      }
      var nodes = [], i;

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
    }

    return filters;
    };
}

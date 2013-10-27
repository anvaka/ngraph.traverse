module.exports = function(graph) {
  return function () {
    // todo: simplify, consider quicker version and bail outs
    var fromNodeId;
    var toNodeId;
    var linkFilter = function (link) { return true; };
    var filters = {
      from: function (nodeId) {
        fromNodeId = nodeId;
        return filters;
      },
      to: function (nodeId) {
        toNodeId = nodeId;
        return filters;
      },
      where: function (predicateCallback) {
        if (typeof predicateCallback !== 'function') {
          throw new Error("where() expects a funciton");
        }
        // todo: Should this be a chain of predicates?
        linkFilter = predicateCallback;
        return filters;
      }
    };

    // vivification function:
    filters.forEach = function (callback) {
      if (typeof callback !== 'function') {
        throw new Error('callback is expected to be a function');
      }

      // todo: this should probably be evaluated code:
      var links = [];
      if (typeof fromNodeId !== 'undefined') {
        graph.forEachLinkedNode(fromNodeId, function(node, link) {
          if (linkFilter(link)) {
            links.push(link);
          }
        }, true);
      } else if (typeof toNodeId !== 'undefined') {
        // use undirected traversal, and filter nodes here
        graph.forEachLinkedNode(toNodeId, function(node, link) {
          if (link.toId === toNodeId && linkFilter(link)) {
            links.push(link);
          }
        }, false);
      } else {
        graph.forEachLink(function(link) {
          if (linkFilter(link)) {
            links.push(link);
          }
        });
      }
      for (var i = 0; i < links.length; ++i) {
        callback(links[i]);
      }
    };
    return filters;
  };
}

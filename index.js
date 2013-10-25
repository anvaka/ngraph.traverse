module.exports = {
  traverse: traverse
};

function traverse(graph) {
  return {
    links: function () {
      // todo: simplify, consider quicker version and bail outs
      var fromNodeId;
      var filters = {
        from: function (nodeId) {
          fromNodeId = nodeId;
          return filters;
        },
        to: function (toNodeId) {
          return filters;
        },
      };

      // vivification function:
      filters.each = function (callback) {
        if (typeof callback !== 'function') {
          throw new Error('callback is expected to be a function');
        }

        var links = [];
        if (typeof fromNodeId !== 'undefined') {
          graph.forEachLinkedNode(fromNodeId, function(node, link) {
            links.push(link);
          }, true);
        } else {
          graph.forEachLink(function(link) {
            links.push(link);
          });
        }
        for (var i = 0; i < links.length; ++i) {
          callback(links[i]);
        }
      };
      return filters;
    }
  };
}

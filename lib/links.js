module.exports = function(graph) {
  return function () {
    return new LinkIterator({}, graph);
  };
}

function LinkIterator(filters, graph) {
  this.filters = filters;
  this.graph = graph;
}

LinkIterator.prototype.to = function(nodeId) {
  var filters = cloneFilter(this.filters);
  filters.toNodeId = nodeId;
  return new LinkIterator(filters, this.graph);
};

LinkIterator.prototype.from = function(nodeId) {
  var filters = cloneFilter(this.filters);
  filters.fromNodeId = nodeId;
  return new LinkIterator(filters, this.graph);
};

LinkIterator.prototype.where = function(predicateCallback) {
  if (typeof predicateCallback !== 'function') {
    throw new Error("where() expects a funciton");
  }

  var filters = cloneFilter(this.filters);
  filters.where = predicateCallback;
  return new LinkIterator(filters, this.graph);
};

LinkIterator.prototype.forEach = function (callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is expected to be a function');
    }
    var fromNodeId = this.filters.fromNodeId;
    var toNodeId = this.filters.toNodeId;
    var graph = this.graph;
    var linkFilter = typeof this.filters.where === 'function' ?
                      this.filters.where :
                      function (link) { return true; };

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

    return this;
};

function cloneFilter(filter) {
  var clone = {};
  for (var key in filter) {
    if (filter.hasOwnProperty(key)) {
      clone[key] = filter[key];
    }
  }

  return clone;
}

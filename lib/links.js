'use strict';

var addFilterForSet = require('./utils').addFilterForSet,
    createFilterPredicate = require('./filter');

module.exports = function (graph) {
  if (typeof graph === 'undefined') {
    throw new Error('graph cannot be null in links traverser');
  }
  return new LinkIterator({}, graph);
};

function LinkIterator(filters, graph) {
  this.filters = filters;
  this.graph = graph;
}

LinkIterator.prototype.to = function(nodeId) {
  var filters = cloneFilter(this.filters);
  addFilterForSet(filters, 'toNodeId', nodeId)
  return new LinkIterator(filters, this.graph);
};

LinkIterator.prototype.from = function(nodeId) {
  var filters = cloneFilter(this.filters);
  addFilterForSet(filters, 'fromNodeId', nodeId)
  return new LinkIterator(filters, this.graph);
};

LinkIterator.prototype.where = function(criteria) {
  var filters = cloneFilter(this.filters);
  filters.where = createFilterPredicate(criteria);
  return new LinkIterator(filters, this.graph);
};

LinkIterator.prototype.forEach = function (callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback is expected to be a function');
    }
    var i, addToLinks, nodeId,
        fromNodeId = this.filters.fromNodeId,
        toNodeId = this.filters.toNodeId,
        graph = this.graph,
        links = [],
        linkFilter = typeof this.filters.where === 'function' ?
                      this.filters.where :
                      function (link) { return true; };


    if (typeof fromNodeId === 'function') {
      fromNodeId = fromNodeId();
    }
    if (typeof toNodeId === 'function') {
      toNodeId = toNodeId();
    }
    var hasBothFiltersDefined = typeof fromNodeId !== 'undefined' && typeof toNodeId !== 'undefined';
    if (typeof fromNodeId !== 'undefined') {
      // special case when both filters are defined, we use "and" operator
      if (typeof toNodeId !== 'undefined') {
        var toLookup = {};
        for (i = 0; i < toNodeId.length; ++i) {
          toLookup[toNodeId[i]] = 1;
        }
        var oldFilter = linkFilter;
        linkFilter = function(link) {
          return toLookup[link.toId] && oldFilter(link);
        }
      }
      addToLinks = function(node, link) {
        if (linkFilter(link)) {
          links.push(link);
        }
      };
      for(i = 0; i < fromNodeId.length; ++i) {
        nodeId = fromNodeId[i];
        graph.forEachLinkedNode(nodeId, addToLinks, true);
      }
    } else if (typeof toNodeId !== 'undefined') {
        for (i = 0; i < toNodeId.length; ++i) {
          nodeId = toNodeId[i];

          addToLinks = function (node, link) {
            if (link.toId === nodeId && linkFilter(link)) {
              links.push(link);
            }
          };
          // use undirected traversal, and filter nodes here
          graph.forEachLinkedNode(nodeId, addToLinks, false);
        }
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

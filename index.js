"use strict";

module.exports = {
  traverse: traverse
};

function traverse(graph) {
  return {
    links: function () {
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
    },

    nodes: function () {
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
    }
  };
}

function isArray(obj) {
  if (typeof obj === 'undefined') { return false; }
  return Object.prototype.toString.call(obj).indexOf("[object Array]") === 0;
}

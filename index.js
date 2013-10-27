"use strict";

module.exports = {
  traverse: traverse
};

function traverse(graph) {
  return {
    links: require('./lib/links')(graph),
    nodes: require('./lib/nodes')(graph)
  };
}

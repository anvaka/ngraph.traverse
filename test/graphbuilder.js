// todo: this should be part of ngraph.generators
module.exports = createTestGraph;
var createGraph = require('ngraph.graph');

function createTestGraph(n) {
  var g = createGraph();
  n = (typeof n === 'number' && n > 1) ? n : 2;
  for (i = 0; i < n; ++i) {
    for (j = i + 1; j < n; ++j) {
        if (i !== j) {
            g.addLink(i, j);
            g.addLink(j, i);
        }
    }
  }
  return g;
}

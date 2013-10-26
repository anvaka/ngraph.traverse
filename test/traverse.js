var test = require('tap').test,
    traverse = require('..').traverse;

test('get all links', function(t) {
  var nodesCount = 5;
  var graph = createTestGraph(nodesCount);
  var expectedLinksCount = graph.getLinksCount();
  var visitedCount = 0;

  traverse(graph)
      .links()
      .each(function(link){
        t.ok(link, "link should be passed as an argument");
        visitedCount += 1;
      });

  t.equal(visitedCount, expectedLinksCount, "Number of edges is not correct");
  t.end();
});

test('get all links from node', function(t) {
  var nodesCount = 5;
  var graph = createTestGraph(nodesCount);
  // it is a complete graph:
  var expectedLinksCount = nodesCount - 1;
  var visitedCount = 0;

  var startNodeId = 0;
  traverse(graph)
      .links()
      .from(startNodeId)
      .each(function(link){
        t.ok(link, "link should be passed as an argument");
        t.equal(link.fromId, startNodeId, "from node id is not correct");
        visitedCount += 1;
      });

  t.equal(visitedCount, expectedLinksCount, "Number of edges is not correct");
  t.end();
});

test('get all links to node', function(t) {
  var nodesCount = 5;
  var graph = createTestGraph(nodesCount);
  // it is a complete graph:
  var expectedLinksCount = nodesCount - 1;
  var visitedCount = 0;

  var endNodeId = 0;
  traverse(graph)
      .links()
      .to(endNodeId)
      .each(function(link){
        t.ok(link, "link should be passed as an argument");
        t.equal(link.toId, endNodeId, "end node id is not correct");
        visitedCount += 1;
      });

  t.equal(visitedCount, expectedLinksCount, "Number of edges is not correct");
  t.end();
});

// todo: this should be part of ngraph.generators
function createTestGraph(n) {
  var createGraph = require('ngraph.graph');
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

var test = require('tap').test,
    traverse = require('..').traverse,
    createGraph = require('ngraph.graph'),
    // complete graph builder
    createCompleteGraph = require('./graphbuilder');

test('get all links', function(t) {
  var nodesCount = 5;
  var graph = createCompleteGraph(nodesCount);
  var expectedLinksCount = graph.getLinksCount();
  var visitedCount = 0;

  traverse(graph)
      .links()
      .forEach(function(link){
        t.ok(link, "link should be passed as an argument");
        visitedCount += 1;
      });

  t.equal(visitedCount, expectedLinksCount, "Number of edges is not correct");
  t.end();
});

test('get all links from node', function(t) {
  var nodesCount = 5;
  var graph = createCompleteGraph(nodesCount);
  // it is a complete graph:
  var expectedLinksCount = nodesCount - 1;
  var visitedCount = 0;

  var startNodeId = 0;
  traverse(graph)
      .links()
      .from(startNodeId)
      .forEach(function(link){
        t.ok(link, "link should be passed as an argument");
        t.equal(link.fromId, startNodeId, "from node id is not correct");
        visitedCount += 1;
      });

  t.equal(visitedCount, expectedLinksCount, "Number of edges is not correct");
  t.end();
});

test('get all links to node', function(t) {
  var nodesCount = 5;
  var graph = createCompleteGraph(nodesCount);
  // it is a complete graph:
  var expectedLinksCount = nodesCount - 1;
  var visitedCount = 0;

  var endNodeId = 0;
  traverse(graph)
      .links()
      .to(endNodeId)
      .forEach(function(link){
        t.ok(link, "link should be passed as an argument");
        t.equal(link.toId, endNodeId, "end node id is not correct");
        visitedCount += 1;
      });

  t.equal(visitedCount, expectedLinksCount, "Number of edges is not correct");
  t.end();
});

test('get filtered links from node', function(t) {
  var graph = createGraph();
  graph.addLink(0, 1, "Lu");
  graph.addLink(1, 2, "Lu");
  graph.addLink(0, 2, "Tako");

  var visitedCount = 0;
  traverse(graph)
      .links()
      .from(0)
      .where(function(link) { return link.data === "Lu"; })
      .forEach(function(link){
        t.ok(link.data, "link should have associated data with it");
        t.equal(link.data, "Lu");
        visitedCount += 1;
      });

  t.equal(visitedCount, 1, "Only one link should be visited");
  t.end();
});

test('get all links filtered', function(t) {
  var graph = createGraph();
  graph.addLink(0, 1, "Lu");
  graph.addLink(1, 2, "Lu");
  graph.addLink(0, 2, "Tako");

  var visitedCount = 0;
  traverse(graph)
      .links()
      .where(function (link) { return link.data === "Lu"; })
      .forEach(function (link){
        t.ok(link.data, "link should have associated data with it");
        t.equal(link.data, "Lu");
        visitedCount += 1;
      });

  t.equal(visitedCount, 2, "Two links should be visited");
  t.end();
});

/*
test('get all links to neighbors', function (t) {
  var graph = createGraph();
  // a small binary tree:
  graph.addLink(0, 1);
  graph.addLink(1, 2); graph.addLink(1, 3);
  graph.addLink(2, 4);

  t.test("visit first level from root", function (t) {
    var startNodeId = 0;
    var visitedCount = 0;

    traverse(graph)
      .links()
      .from(startNodeId)
      .to()
      .forEach(function (link) {
        visitedCount += 1;
        t.ok(link, "Link should be present");
      });
    t.equal(visitedCount, 1, "Should visit four neighbors");
    t.end();
  });

});

*/

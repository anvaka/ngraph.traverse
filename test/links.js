var test = require('tap').test,
    traverse = require('..'),
    traverseLinks = traverse.links,
    createGraph = require('ngraph.graph'),
    // complete graph builder
    createCompleteGraph = require('./graphbuilder');

test('get all links', function(t) {
  var nodesCount = 5;
  var graph = createCompleteGraph(nodesCount);
  var expectedLinksCount = graph.getLinksCount();
  var visitedCount = 0;

  traverseLinks(graph)
    .forEach(function (link) {
      t.ok(link, 'link should be passed as an argument');
      visitedCount += 1;
    });

  t.equal(visitedCount, expectedLinksCount, 'Number of edges is not correct');
  t.end();
});

test('get all links from node', function(t) {
  var nodesCount = 5;
  var graph = createCompleteGraph(nodesCount);
  // it is a complete graph:
  var expectedLinksCount = nodesCount - 1;
  var visitedCount = 0;

  var startNodeId = 0;
  traverseLinks(graph)
    .from(startNodeId)
    .forEach(function (link) {
      t.ok(link, 'link should be passed as an argument');
      t.equal(link.fromId, startNodeId, 'from node id is not correct');
      visitedCount += 1;
    });

  t.equal(visitedCount, expectedLinksCount, 'Number of edges is not correct');
  t.end();
});

test('get all links to node', function(t) {
  var nodesCount = 5;
  var graph = createCompleteGraph(nodesCount);
  // it is a complete graph:
  var expectedLinksCount = nodesCount - 1;
  var visitedCount = 0;

  var endNodeId = 0;
  traverseLinks(graph)
    .to(endNodeId)
    .forEach(function(link){
      t.ok(link, 'link should be passed as an argument');
      t.equal(link.toId, endNodeId, 'end node id is not correct');
      visitedCount += 1;
    });

  t.equal(visitedCount, expectedLinksCount, 'Number of edges is not correct');
  t.end();
});

test('get links form to', function(t) {
  var graph = createGraph();
  graph.addLink(0, 1); graph.addLink(1, 2);
  traverseLinks(graph)
    .from(0)
    .to(2)
    .forEach(function(link) {
      t.fail('Graph does not have such link');
    })
  t.end();
});

test('get filtered links from node', function(t) {
  var graph = createGraph();
  graph.addLink(0, 1, 'Lu');
  graph.addLink(1, 2, 'Lu');
  graph.addLink(0, 2, 'Tako');

  var visitedCount = 0;
  traverseLinks(graph)
    .from(0)
    .where(function(link) { return link.data === 'Lu'; })
    .forEach(function(link){
      t.ok(link.data, 'link should have associated data with it');
      t.equal(link.data, 'Lu');
      visitedCount += 1;
    });

  t.equal(visitedCount, 1, 'Only one link should be visited');
  t.end();
});

test('get all links filtered', function(t) {
  var graph = createGraph();
  graph.addLink(0, 1, 'Lu');
  graph.addLink(1, 2, 'Lu');
  graph.addLink(0, 2, 'Tako');

  var visitedCount = 0;
  traverseLinks(graph)
    .where(function (link) { return link.data === 'Lu'; })
    .forEach(function (link){
      t.ok(link.data, 'link should have associated data with it');
      t.equal(link.data, 'Lu');
      visitedCount += 1;
    });

  t.equal(visitedCount, 2, 'Two links should be visited');
  t.end();
});

test('get all links to neighbors', function (t) {
  var graph = createGraph();
  // a small graph:
  //    0 -> 1
  //       2   3
  //     4
  graph.addLink(0, 1);
  graph.addLink(1, 2); graph.addLink(1, 3);
  graph.addLink(2, 4);

  t.test('visit custom set of to nodes', function (t) {
    var startNodeId = 0;
    var visitedCount = 0;

    traverseLinks(graph)
      .to([2, 3])
      .forEach(function (link) {
        visitedCount += 1;
        t.ok(link.toId === 2 || link.toId === 3, 'Link should go to either 2 or 3');
      });
    t.equal(visitedCount, 2, 'Unexpected number of links visited');
    t.end();
  });

  t.test('visit custom set of from and to', function(t) {
    var startNodeId = 0;
    var visitedCount = 0;

    traverseLinks(graph)
      .from([0, 1])
      .to([2, 4, 1])
      .forEach(function (link) {
        visitedCount += 1;
        var fromIsGood = link.fromId === 0 || link.formId === 1;
        var toIsGood = link.toId === 2 || link.toId === 4 || link.toId === 1;
        t.ok(fromIsGood || toIsGood, 'Link has unexpected start or end');
      });
    // with our configuration only two links are reachable:
    t.equal(visitedCount, 2, 'Unexpected number of links visited');
    t.end();
  })

  t.test('visit custom set of from nodes', function (t) {
    var startNodeId = 0;
    var visitedCount = 0;

    traverseLinks(graph)
      .from([1, 2])
      .forEach(function (link) {
        visitedCount += 1;
        t.ok(link.fromId === 1 || link.fromId === 2, 'Link should go to either 2 or 3');
      });
    t.equal(visitedCount, 3, 'Unexpected number of links visited');
    t.end();
  });

  t.test('visit grandchildren', function(t) {
    // graph reminder:
    //    0 -> 1
    //       2   3
    //     4
    var nodes = traverse.nodes(graph);
    var links = traverse.links(graph);
    var children = nodes.neighbors(1);
    var grandChildren = nodes.neighbors(children);
    var totalVisited = 0;
    links.from(1).to(children)
      .forEach(function(link) {
        t.ok(link.toId === 2 || link.toId === 3, 'Unexpected link visited');
        totalVisited++;
      });

    links.from(children).to(grandChildren)
      .forEach(function(link) {
        t.ok(link.toId === 4, 'Unexpected link visited');
        totalVisited++;
      });
    t.equal(totalVisited, 3, 'Only three nodes should be visited in this test')
    t.end();
  });
  t.end();
});

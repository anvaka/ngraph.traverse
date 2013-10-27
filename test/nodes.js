var test = require('tap').test,
    traverse = require('..').traverse,
    createGraph = require('ngraph.graph'),
    createCompleteGraph = require('./graphbuilder');

test('Visit all nodes', function (t) {
  var g = createCompleteGraph(5);

  var visitedNodes = 0;
  traverse(g)
    .nodes()
    .forEach(function (node) {
      t.ok(node, "Node should be present");
      visitedNodes++;
    });

  t.equal(visitedNodes, 5, "Expected to visit 5 nodes");
  t.end();
});

test('Visit all neighbors', function (t) {
  var g = createCompleteGraph(5);

  var visitedNodes = 0;
  var startFrom = 0;
  traverse(g)
    .nodes()
    .neighbors(startFrom)
    .forEach(function (node) {
      t.notEqual(startFrom, node.id);
      visitedNodes++;
    });

  t.equal(visitedNodes, 4, "Expected to visit 4 nodes");
  t.end();
});
/*

*/

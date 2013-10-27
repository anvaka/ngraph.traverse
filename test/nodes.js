var test = require('tap').test,
    traverseNodes = require('..').nodes,
    createGraph = require('ngraph.graph'),
    createCompleteGraph = require('./graphbuilder');

test('Visit all nodes', function (t) {
  var g = createCompleteGraph(5);

  var visitedNodes = 0;
  traverseNodes(g)
    .forEach(function (node) {
      t.ok(node, "Node should be present");
      visitedNodes++;
    });

  t.equal(visitedNodes, 5, "Expected to visit 5 nodes");
  t.end();
});

test('Visit only listed neighbors', function (t) {
  var g = createBinTree(5);
  // our tree is a bin tree of the following form:
  //          1
  //        2    3
  //      4  5  6  7
  //  ... five levels ...
  // We are expecting to visit from node 1 and 2,
  // thus:
  var expectedNodes = [2, 3, 4, 5];

  var visitedNodes = 0;
  traverseNodes(g)
    .neighbors([1, 2])
    .forEach(function (node) {
      visitedNodes++;
      var visitedCorrectNode = expectedNodes.indexOf(node.id) !== -1;
      t.ok(visitedCorrectNode, 'Visited unexpected node: ' + node.id);
    });

  t.equal(visitedNodes, expectedNodes.length, 'Unexpected nodes were visited');
  t.end();
});

test('Visit all neighbors', function (t) {
  var g = createBinTree(5);

  var visitedNodes = 0;
  var startFrom = 1;
  traverseNodes(g)
    .neighbors(startFrom)
    .forEach(function (node) {
      t.notEqual(startFrom, node.id);
      visitedNodes++;
    });

  t.equal(visitedNodes, 2, "Expected to visit 2 nodes");
  t.end();
});

test('Visit all grandchildren', function (t) {
  var g = createBinTree(5);

  var visitedNodes = 0;
  var startFrom = 1;
  var nodes = traverseNodes(g);
  var children = nodes.neighbors(startFrom);
  var grandChildren = nodes.neighbors(children);

  grandChildren.forEach(function (node) {
      t.notEqual(startFrom, node.id);
      visitedNodes++;
    });

  t.equal(visitedNodes, 4, "Expected to visit 4 nodes");
  t.end();
});

function createBinTree(depth) {
  var g = createGraph(),
      count = Math.pow(2, depth),
      level;

  for (level = 1; level < count; ++level) {
      var root = level,
          left = root * 2,
          right = root * 2 + 1;

      g.addLink(root, left);
      g.addLink(root, right);
  }

  return g;
}

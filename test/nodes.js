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
  var g = createBinTree(5);

  var visitedNodes = 0;
  var startFrom = 1;
  traverse(g)
    .nodes()
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
  var nodes = traverse(g).nodes();
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

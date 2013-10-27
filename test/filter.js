var filter = require('../lib/filter'),
    test = require('tap').test;

test('Can match simple types', function(t) {
  t.test('can match strings', function(t){
    var predicate = filter('hello');
    t.ok(predicate('hello'), 'should match strings');
    t.ok(!predicate('foo'), 'should not match when there is no match');
    t.ok(!predicate(), 'should not match when there is no match');
    t.end();
  });

  t.test('can match numbers', function(t){
    var predicate = filter(42);
    t.ok(predicate(42), 'should match strings');
    t.ok(!predicate('foo'), 'should not match when there is no match');
    t.ok(!predicate(10), 'should not match when there is no match');
    t.ok(!predicate(), 'should not match when there is no match');
    t.end();
  });

  t.end();
});

test('Can take custom predicate', function(t) {
  t.plan(2);
  var customPredicate = function (x) {
    t.pass('Method should be called');
    return false;
  }
  var predicate = filter(customPredicate);
  t.ok(!predicate('hello'), 'Custom predicate should be executed');
  t.end();
});

test('Can take objects', function(t) {
  var testUser = { name: 'alla' };
  var predicate = filter({ name: 'a' });
  t.ok(predicate(testUser), 'Object predicate should match');
  t.ok(!predicate('hello'), 'Object predicate should not match');
  t.ok(!predicate(), 'should not match when there is no match');
  t.end();
});

test('Can match numbers', function(t) {
  var testUser = { name: 'Sergey', year: 1973 };
  var predicate = filter({ year: 1973 });
  t.ok(predicate(testUser), 'Object predicate should match');
  t.ok(!predicate({year: 199}), 'Object predicate should not match');
  t.ok(!predicate('hello'), 'Object predicate should not match');
  t.ok(!predicate(), 'should not match when there is no match');
  t.end();
});

test('Does not match objects with missing fields', function(t) {
  var testUser = { name: 'alla' };
  var predicate = filter({ lastName: 'a' });
  t.ok(!predicate(testUser), 'Object predicate should not match');
  t.ok(!predicate('hello'), 'Object predicate should not match');
  t.ok(!predicate(), 'should not match when there is no match');
  t.end();
});

test('Object predicate with multiple fields', function(t) {
  var testUser = { first: 'john', last: 'smith' };
  var predicate = filter({ first: 'j', last: 'smith' });
  t.ok(predicate(testUser), 'Object predicate should match');
  t.ok(!predicate({ first: 'john'}), 'Object predicate should not partial match');
  t.ok(!predicate('hello'), 'Object predicate should not match');
  t.ok(!predicate(), 'should not match when there is no match');
  t.end();
});

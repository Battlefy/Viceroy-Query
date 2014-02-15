
var test = require('tape');
var util = require('util');
var Query = require('../').Query;

test('Query()', function(t) {
  t.throws(function() { new Query(); });
  t.throws(function() { new Query(null); });
  t.throws(function() { new Query(1); });
  t.throws(function() { new Query('s'); });
  t.doesNotThrow(function() { new Query({}); });
  t.end();
});

test('query{}', function(t) {
  var query = new Query({});
  t.equal(typeof query.match, 'function');
  t.equal(typeof query.filter, 'function');
  t.equal(typeof query.query, 'object');
  t.equal(typeof query.opts, 'object');
  t.end();
});

test('query.match()', function(t) {

  var query = new Query({ prop: 'val' });
  t.ok(query.match({ prop: 'val' }));
  t.ok(query.match({ prop: 'val', prop2: 'val2' }));
  t.ok(query.match({ prop: 'val', prop2: { subProp: 'subVal' } }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({ prop: 1 }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: 'val1' }));
  t.notOk(query.match({ prop: '1val' }));

  query = new Query({ prop: /val[\d]+/ });
  t.ok(query.match({ prop: 'val1' }));
  t.ok(query.match({ prop: 'val2', prop2: 'val2' }));
  t.ok(query.match({ prop: 'val3443', prop2: { subProp: 'subVal' } }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({ prop: 1 }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: 'val' }));
  t.notOk(query.match({ prop: '1val' }));

  query = new Query({ prop: { subProp: 'val' } });
  t.ok(query.match({ prop: { subProp: 'val' } }));
  t.ok(query.match({ prop: { subProp: 'val' }, prop2: 'val2' }));
  t.ok(query.match({ prop: { subProp: 'val', prop2: 'val2'} }));
  t.ok(query.match({ prop: { subProp: 'val' }, prop2: { subProp: 'subVal' } }));
  t.notOk(query.match({ prop: 'val' }));
  t.notOk(query.match({ prop: 'val1' }));
  t.notOk(query.match({ prop: '1val' }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: { subProp: {} } }));
  t.notOk(query.match({ prop: { subProp: 1 } }));
  t.notOk(query.match({ prop: { subProp: null } }));
  t.notOk(query.match({ prop: { subProp: undefined } }));
  t.notOk(query.match({ prop: { subProp: 'val1' } }));
  t.notOk(query.match({ prop: { subProp: '1val' } }));

  query = new Query({ prop: { $not: 'val' } });
  t.ok(query.match({}));
  t.ok(query.match({ prop: 'val1' }));
  t.ok(query.match({ prop: '1val' }));
  t.ok(query.match({ prop: null }));
  t.ok(query.match({ prop: undefined }));
  t.ok(query.match({ prop: {} }));
  t.ok(query.match({ prop: 1 }));
  t.ok(query.match({ prop: 0 }));
  t.notOk(query.match({ prop: 'val' }));

  query = new Query({ prop: { $exists: true } });
  t.ok(query.match({ prop: 'val1' }));
  t.ok(query.match({ prop: '1val' }));
  t.ok(query.match({ prop: null }));
  t.ok(query.match({ prop: {} }));
  t.ok(query.match({ prop: 1 }));
  t.ok(query.match({ prop: 0 }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({}));

  query = new Query({ prop: { $in: ['val1', 'val2'] } });
  t.ok(query.match({ prop: 'val1' }));
  t.ok(query.match({ prop: 'val2' }));
  t.notOk(query.match({ prop: '1val' }));
  t.notOk(query.match({ prop: 'val' }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: 1 }));
  t.notOk(query.match({ prop: 0 }));
  t.notOk(query.match({}));

  query = new Query({ prop: { $notIn: ['val1', 'val2'] } });
  t.ok(query.match({ prop: '1val' }));
  t.ok(query.match({ prop: 'val' }));
  t.ok(query.match({ prop: null }));
  t.ok(query.match({ prop: {} }));
  t.ok(query.match({ prop: undefined }));
  t.ok(query.match({ prop: 1 }));
  t.ok(query.match({ prop: 0 }));
  t.ok(query.match({}));
  t.notOk(query.match({ prop: 'val1' }));
  t.notOk(query.match({ prop: 'val2' }));

  query = new Query({ prop: { $gt: 5 } });
  t.ok(query.match({ prop: 6 }));
  t.notOk(query.match({ prop: 5 }));
  t.notOk(query.match({ prop: 0 }));
  t.notOk(query.match({ prop: 'val' }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({}));

  query = new Query({ prop: { $gt: 'c' } });
  t.ok(query.match({ prop: 'd' }));
  t.notOk(query.match({ prop: 'b' }));
  t.notOk(query.match({ prop: 4 }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({}));

  query = new Query({ prop: { $lt: 5 } });
  t.ok(query.match({ prop: 4 }));
  t.ok(query.match({ prop: 0 }));
  t.notOk(query.match({ prop: 5 }));
  t.notOk(query.match({ prop: 6 }));
  t.notOk(query.match({ prop: 'val' }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({}));

  query = new Query({ prop: { $lt: 'c' } });
  t.ok(query.match({ prop: 'b' }));
  t.notOk(query.match({ prop: 'd' }));
  t.notOk(query.match({ prop: 2 }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({}));

  t.end();
});

test('query.filter()', function(t) {

  var data = [
    { prop: 'val', prop2: 'val2', prop3: 'val3' },
    { prop: 'val', prop2: 'val2' },
    { prop: 'val', prop2: 'val2', prop3: 'val3', prop4: { subProp: 'subVal' } },
    { prop: 'val', prop2: 'val2' },
    { prop2: 'val2' }
  ];
  var query = new Query({ prop: 'val' });
  var result = query.filter(data);
  t.equal(result.length, 4);
  t.equal(result.indexOf(data[4]), -1);

  query = new Query({ prop: 'val', $limit: 1 });
  result = query.filter(data);
  t.equal(result.length, 1);
  t.equal(result[0], data[0]);

  query = new Query({ prop: 'val', $offset: 1 });
  result = query.filter(data);
  t.equal(result.length, 3);
  t.equal(result.indexOf(data[0]), -1);

  query = new Query({ prop: 'val', $fields: ['prop2'] });
  result = query.filter(data);
  t.equal(result.length, 4);
  for(var i = 0; i < result.length; i += 1) {
    t.notOk(result[i].prop);
    t.notOk(result[i].prop3);
    t.notOk(result[i].prop4);
    t.ok(result[i].prop2);
  }

  query = new Query({ prop: 'val', $fields: ['prop3'] });
  result = query.filter(data);
  t.equal(result.length, 2);
  for(var i = 0; i < result.length; i += 1) {
    t.notOk(result[i].prop);
    t.notOk(result[i].prop2);
    t.notOk(result[i].prop4);
    t.ok(result[i].prop3);
  }

  query = new Query({ prop: 'val', $fields: ['prop4.subProp'] });
  result = query.filter(data);
  t.equal(result.length, 1);
  for(var i = 0; i < result.length; i += 1) {
    t.notOk(result[i].prop);
    t.notOk(result[i].prop2);
    t.notOk(result[i].prop3);
    t.ok(result[i].prop4);
    t.ok(result[i].prop4.subProp);
  }

  t.end();
});

test('query.query{}', function(t) {

  var query = new Query({ prop: 'val', prop2: 'val2' });
  t.equal(query.query.prop, 'val');
  t.equal(query.query.prop2, 'val2');

  query = new Query({ $limit: 1 });
  t.notOk(query.query.$limit);

  query = new Query({ $offset: 1 });
  t.notOk(query.query.$offset);

  query = new Query({ $fields: ['prop'] });
  t.notOk(query.query.$fields);

  t.end();
});

test('query.opts{}', function(t) {

  var query = new Query({ prop: 'val', prop2: 'val2' });
  t.notOk(query.opts.prop);
  t.notOk(query.opts.prop2);

  query = new Query({ $limit: 1 });
  t.ok(query.opts.limit);

  query = new Query({ $offset: 1 });
  t.ok(query.opts.offset);

  query = new Query({ $fields: ['prop'] });
  t.ok(query.opts.fields);

  t.end();
});

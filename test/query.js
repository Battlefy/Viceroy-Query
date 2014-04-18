
var test = require('tape');
var util = require('util');
var createQuery = require('../');

test('Query()', function(t) {
  t.throws(function() { createQuery(); });
  t.throws(function() { createQuery(null); });
  t.throws(function() { createQuery(1); });
  t.throws(function() { createQuery('s'); });
  t.doesNotThrow(function() { createQuery({}); });
  t.end();
});

test('query{}', function(t) {
  var query = createQuery({});
  t.equal(typeof query.match, 'function');
  t.equal(typeof query.filter, 'function');
  t.equal(typeof query.valueOf, 'function');
  t.equal(typeof query.toJSON, 'function');
  t.equal(typeof query.toString, 'function');
  t.equal(typeof query.query, 'object');
  t.equal(typeof query.opts, 'object');
  t.end();
});

test('query.match()', function(t) {

  var query = createQuery({});
  t.throws(function() { query.match(); });
  t.throws(function() { query.match(null); });
  t.throws(function() { query.match(1); });
  t.throws(function() { query.match('s'); });
  t.doesNotThrow(function() { query.match({}); });

  query = createQuery({ $invalidOpt: 1 });
  t.throws(function() { query.match({}); });
  query = createQuery({ prop: { $in: [], invalid: true } });
  t.throws(function() { query.match({}); });

  query = createQuery({ prop: 'val' });
  t.ok(query.match({ prop: 'val' }));
  t.ok(query.match({ prop: 'val', prop2: 'val2' }));
  t.ok(query.match({ prop: 'val', prop2: { subProp: 'subVal' } }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({ prop: 1 }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: 'val1' }));
  t.notOk(query.match({ prop: '1val' }));

  query = createQuery({ prop: /val[\d]+/ });
  t.ok(query.match({ prop: 'val1' }));
  t.ok(query.match({ prop: 'val2', prop2: 'val2' }));
  t.ok(query.match({ prop: 'val3443', prop2: { subProp: 'subVal' } }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({ prop: 1 }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: 'val' }));
  t.notOk(query.match({ prop: '1val' }));

  query = createQuery({ prop: { subProp: 'val' } });
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

  query = createQuery({ prop: { $not: 'val' } });
  t.ok(query.match({}));
  t.ok(query.match({ prop: 'val1' }));
  t.ok(query.match({ prop: '1val' }));
  t.ok(query.match({ prop: null }));
  t.ok(query.match({ prop: undefined }));
  t.ok(query.match({ prop: {} }));
  t.ok(query.match({ prop: 1 }));
  t.ok(query.match({ prop: 0 }));
  t.notOk(query.match({ prop: 'val' }));

  query = createQuery({ prop: { $exists: true } });
  t.ok(query.match({ prop: 'val1' }));
  t.ok(query.match({ prop: '1val' }));
  t.ok(query.match({ prop: null }));
  t.ok(query.match({ prop: {} }));
  t.ok(query.match({ prop: 1 }));
  t.ok(query.match({ prop: 0 }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({}));

  query = createQuery({ prop: { $in: ['val1', 'val2'] } });
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

  query = createQuery({ prop: { $notIn: ['val1', 'val2'] } });
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

  query = createQuery({ prop: { $gt: 5 } });
  t.ok(query.match({ prop: 6 }));
  t.notOk(query.match({ prop: 5 }));
  t.notOk(query.match({ prop: 0 }));
  t.notOk(query.match({ prop: 'val' }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({}));

  query = createQuery({ prop: { $gt: 'c' } });
  t.ok(query.match({ prop: 'd' }));
  t.notOk(query.match({ prop: 'b' }));
  t.notOk(query.match({ prop: 4 }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({}));

  query = createQuery({ prop: { $lt: 5 } });
  t.ok(query.match({ prop: 4 }));
  t.ok(query.match({ prop: 0 }));
  t.notOk(query.match({ prop: 5 }));
  t.notOk(query.match({ prop: 6 }));
  t.notOk(query.match({ prop: 'val' }));
  t.notOk(query.match({ prop: undefined }));
  t.notOk(query.match({ prop: null }));
  t.notOk(query.match({ prop: {} }));
  t.notOk(query.match({}));

  query = createQuery({ prop: { $lt: 'c' } });
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

  t.throws(function() { createQuery({ $limit: 's' }) });
  t.throws(function() { createQuery({ $limit: null }); });
  t.throws(function() { createQuery({ $limit: {} }); });
  t.doesNotThrow(function() { createQuery({ $limit: 1 }); });

  t.throws(function() { createQuery({ $offset: 's' }); });
  t.throws(function() { createQuery({ $offset: null }); });
  t.throws(function() { createQuery({ $offset: {} }); });
  t.doesNotThrow(function() { createQuery({ $offset: 1 }); });

  t.throws(function() { createQuery({ $fields: 's' }); });
  t.throws(function() { createQuery({ $fields: null }); });
  t.throws(function() { createQuery({ $fields: {} }); });
  t.throws(function() { createQuery({ $fields: [] }); });
  t.throws(function() { createQuery({ $fields: [{}] }); });
  t.throws(function() { createQuery({ $fields: [1] }); });
  t.throws(function() { createQuery({ $fields: [null] }); });
  t.doesNotThrow(function() { createQuery({ $fields: ['prop'] }); });
  t.doesNotThrow(function() { createQuery({ $fields: ['prop', 'prop2'] }); });

  var query = createQuery({ prop: 'val' });
  t.throws(function() { query.filter(); });
  t.throws(function() { query.filter({}); });
  t.throws(function() { query.filter(null); });
  t.throws(function() { query.filter(1); });
  t.throws(function() { query.filter('s'); });
  t.doesNotThrow(function() { query.filter([]); });
  t.doesNotThrow(function() { query.filter([{}]); });

  var data = [
    { prop: 'val', prop2: 'val2', prop3: 'val3', prop5: 'val3' },
    { prop: 'val', prop2: 'val2', prop5: 'val4' },
    { prop: 'val', prop2: 'val2', prop3: 'val3', prop4: { subProp: { subProp: 'subVal' }}, prop5: 'val1' },
    { prop: 'val', prop2: 'val2', prop5: 'val5' },
    { prop2: 'val2', prop5: 'val2' }
  ];
  var query = createQuery({ prop: 'val' });
  var result = query.filter(data);
  t.equal(result.length, 4);
  t.equal(result.indexOf(data[4]), -1);

  query = createQuery({ prop: 'val', $limit: 1 });
  result = query.filter(data);
  t.equal(result.length, 1);
  t.equal(result[0], data[0]);

  query = createQuery({ prop: 'val', $offset: 1 });
  result = query.filter(data);
  t.equal(result.length, 3);
  t.equal(result.indexOf(data[0]), -1);

  query = createQuery({ prop: 'val', $fields: ['prop2'] });
  result = query.filter(data);
  t.equal(result.length, 4);
  for(var i = 0; i < result.length; i += 1) {
    t.notOk(result[i].prop);
    t.notOk(result[i].prop3);
    t.notOk(result[i].prop4);
    t.ok(result[i].prop2);
  }

  query = createQuery({ prop: 'val', $fields: ['prop3'] });
  result = query.filter(data);
  t.equal(result.length, 2);
  for(var i = 0; i < result.length; i += 1) {
    t.notOk(result[i].prop);
    t.notOk(result[i].prop2);
    t.notOk(result[i].prop4);
    t.ok(result[i].prop3);
  }

  query = createQuery({ prop: 'val', $fields: ['prop4.subProp.subProp'] });
  result = query.filter(data);
  t.equal(result.length, 1);
  for(var i = 0; i < result.length; i += 1) {
    t.notOk(result[i].prop);
    t.notOk(result[i].prop2);
    t.notOk(result[i].prop3);
    t.ok(result[i].prop4);
    t.ok(result[i].prop4.subProp);
    t.ok(result[i].prop4.subProp.subProp);
    t.equal(result[i].prop4.subProp.subProp, 'subVal');
  }

  query = createQuery({ prop: 'val', $sort: [{ prop5: 'asc' }] });
  result = query.filter(data);
  t.equal(result.length, 4);
  t.deepEqual(result[0], data[2]);
  t.deepEqual(result[1], data[0]);
  t.deepEqual(result[2], data[1]);
  t.deepEqual(result[3], data[3]);
  t.end();
});

test('query.valueOf()', function(t) {
  var query = { prop: 'val' };
  t.deepEqual(createQuery(query).valueOf(), query);
  t.end();
});

test('query.toJSON()', function(t) {
  var query = { prop: 'val' };
  t.deepEqual(createQuery(query).toJSON(), query);
  t.end();
});

test('query.toString()', function(t) {
  var query = { prop: 'val' };
  var queryStr = JSON.stringify(query);
  t.deepEqual(createQuery(query).toString(), queryStr);
  t.end();
});

test('query.query{}', function(t) {

  var query = createQuery({ prop: 'val', prop2: 'val2' });
  t.equal(query.query.prop, 'val');
  t.equal(query.query.prop2, 'val2');

  query = createQuery({ $limit: 1 });
  t.notOk(query.query.$limit);

  query = createQuery({ $offset: 1 });
  t.notOk(query.query.$offset);

  query = createQuery({ $fields: ['prop'] });
  t.notOk(query.query.$fields);

  t.end();
});

test('query.opts{}', function(t) {

  var query = createQuery({ prop: 'val', prop2: 'val2' });
  t.notOk(query.opts.prop);
  t.notOk(query.opts.prop2);

  query = createQuery({ $limit: 1 });
  t.ok(query.opts.limit);

  query = createQuery({ $offset: 1 });
  t.ok(query.opts.offset);

  query = createQuery({ $fields: ['prop'] });
  t.ok(query.opts.fields);

  t.end();
});

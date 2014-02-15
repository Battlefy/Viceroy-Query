Viceroy Query
=============

Viceroy Query is a query language developed for
the Viceroy ORM.

Example
-------
```javascript
var query = require('viceroy-query');

// create a query for fresh apples.
var q = query({
  kind: 'apple',
  sweetness: { $gt: 60, $lt: 90 }
});

// our array of fruits.
var fruits = [
  { kind: 'apple', sweetness: 74 },
  { kind: 'bannana', sweetness: 54 },
  { kind: 'mango', sweetness: 81 },
  { kind: 'apple', sweetness: 99 },
  { kind: 'mango', sweetness: 40 },
  { kind: 'apple', sweetness: 44 },
  { kind: 'apple', sweetness: 61 },
  { kind: 'bannana', sweetness: 97 }
];

// filter the fresh apples from the lot.
var freshApples = q.filter(fruits);
freshApples => [
  { kind: 'apple', sweetness: 74 },
  { kind: 'apple', sweetness: 61 }
];

// our a random fruit.
var randomFruit = { kind: 'apple', sweetness: 74 };

// check to see if the fruit matches the query.
var isMatch = q.match(randomFruit);
isMatch => true
```

Match
-----
```javascript
q.match(Object data) => Boolean isMatch;
```
Checks an object against the query.

Filter
------
```javascript
q.filter(Array dataSet) => Array matches;
```
Checks each item in a data set against the query.
Returns an array containing the matching items.

Possible Query Properties
-------------------------
Below is an example of the possible fields in
a query object.

```javascript
{
  field: 'value',
  field: /pattern/,
  field: { $in: ['value1', 'value2'] },
  field: { $notIn: ['notvalue1', 'notvalue2'] },
  field: { $not: 'notvalue' },
  field: { $gt: 1 },
  field: { $gt: 'a' },
  field: { $ln: 1 },
  field: { $ln: 'a' },
  field: { $exists: true },
  $fields: ['field1', 'field2'],
  $offset: 0,
  $limit: 10
}
```

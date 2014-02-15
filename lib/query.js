

function Query(query) {

  // validate query
  if(query === null || typeof query != 'object') { throw new Error('query must be an object'); }

  // extract opts
  var opts = this._extractOpts(query);

  // setup
  this.opts = opts;
  this.query = query;
}

Query.prototype.filter = function(dataSet) {

  // validate
  if(dataSet === null || typeof dataSet != 'object' || typeof dataSet.length != 'number') {
    throw new Error('data must be an array or array like object');
  }

  // grab each match
  var matches = [];
  var offset = this.opts.offset;
  for(var i = 0; i < dataSet.length; i += 1) {

    // break out of the loop if the match limit
    // has been reached
    if(this.opts.limit !== undefined &&  matches.length >= this.opts.limit) {
      break;
    }

    // check the current data for a match with the
    // query.
    if(this.match(dataSet[i])) {

      // decrement the offset
      if(offset !== undefined && offset > 0) { offset -= 1; }

      // add matches
      else {
        if(this.opts.fields !== undefined) {
          var match = this._extractFields(this.opts.fields, dataSet[i]);
          if(match) { matches.push(match); }
        } else {
          matches.push(dataSet[i]);
        }
      }
    }
  }

  // return the results
  return matches;
};

Query.prototype.match = function(data) {
  return (function rec(data, query) {
    for(var prop in query) {

      // validate
      if(prop.charAt(0) == '$') { throw new Error('invalid query. ' + prop + ' not allowed in query body'); }
      
      // match query object
      if(query[prop] !== null && typeof query[prop] == 'object') {

        // regex
        if(query[prop].constructor == RegExp) {
          if(!query[prop].test(data[prop])) { return false; }
        }

        else {
          for(var subProp in query[prop]) { break; }

          // conditionals
          if(subProp.charAt(0) == '$') {

            // validate
            for(var subProp in query[prop]) {
              if(subProp.charAt(0) != '$') { throw new Error('invalid query. ' + prop + ' not allowed in conditional block'); }
            }

            // match
            if(query[prop].$exists && data[prop] === undefined) { return false; }
            if(query[prop].$lt && (query[prop].$lt <= data[prop] || typeof data[prop] != typeof query[prop].$lt)) { return false; }
            if(query[prop].$gt && (query[prop].$gt >= data[prop] || typeof data[prop] != typeof query[prop].$gt)) { return false; }
            if(query[prop].$not && data[prop] === query[prop].$not) { return false; }
            if(query[prop].$in && query[prop].$in.indexOf(data[prop]) == -1) { return false; }
            if(query[prop].$notIn && query[prop].$notIn.indexOf(data[prop]) != -1) { return false; }
          }

          // sub object query
          else {
            if(!data[prop] || typeof data[prop] != 'object') { return false; }
            if(!rec(data[prop], query[prop])) { return false; }
          } 
        }
      }

      // match query value
      else {
        if(query[prop] !== data[prop]) { return false; }
      }
    }
    return true;
  })(data, this.query);
};

Query.prototype._extractOpts = function(query) {
  var opts = {};

  // validate and extract
  if(query.$limit) {
    if(typeof query.$limit != 'number') { throw new Error('query.$limit must be a number'); }
    opts.limit = query.$limit;
    delete query.$limit;
  }
  if(query.$offset) {
    if(typeof query.$offset != 'number') { throw new Error('query.$offset must be a number'); }
    opts.offset = query.$offset;
    delete query.$offset;
  }
  if(query.$fields) {
    if(query.$fields === null || typeof query.$fields != 'object' || query.$fields.constructor != Array) {
      throw new Error('query.$fields must be an array');
    }
    for(var i = 0; i < query.$fields.length; i += 1) {
      if(typeof query.$fields[i] != 'string') { throw new Error('query.$fields must only contain strings'); }
    }
    opts.fields = query.$fields;
    delete query.$fields;
  }

  return opts;
};


Query.prototype._extractFields = function(fields, data) {
  var newData = null;
  for(var i = 0; i < fields.length; i += 1) {
    var pathChunks = fields[i].split('.');
    var src = data;
    var dst;
    for(var i = 0; i < pathChunks.length; i += 1) {
      var pathChunk = pathChunks[i];
      if(src[pathChunk] !== undefined) {
        if(!newData) { dst = newData = {}; }
        if(typeof src[pathChunk] == 'object') {
          if(typeof dst[pathChunk] != 'object') { dst[pathChunk] = {}; }
          src = src[pathChunk];
          dst = dst[pathChunk];
        } else {
          dst[pathChunk] = src[pathChunk];
        }
      } else { break; }
    }
  }
  return newData;
};

module.exports = Query;

var Query = require('./lib/query');
exports = module.exports = function(query) {
  return new Query(query);
};
exports.Query = Query;
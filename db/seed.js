require('./connect');
var Item = require('../models/item');
var mongoose = require('mongoose');
    
exports.run = function (callback, errback) {
  Item.create({ name: 'Broad beans' },
              { name: 'Tomatoes' },
              { name: 'Peppers' },
    function (err, items) {
      if (err) {
        errback(err);
        return;
      }
      callback(items);
    });
};

if (require.main === module) {
  exports.run(function () {
    mongoose.disconnect();
  }, function (err) {
    console.error(err);
  });
}

var Item = require('../models/item');

exports.save = function (name, callback, errback) {
  Item.create({ name: name }, function (err, item) {
    if (err) {
      errback(err);
      return;
    }
    callback(item);
  });
};

exports.list = function (callback, errback) {
  Item.find(function (err, items) {
    if (err) {
      errback(err);
      return [];
    }
    return callback(items);
  });
};

exports.get = function (id, callback, errback) {
  Item.findOne({ _id: id }, function (err, item) {
    if (err) {
      errback(err);
      return;
    }
    callback(item);
  });
};

exports.delete = function (id, callback, errback) {
  Item.findOneAndRemove({ _id: id }, function (err, item) {
    if (err) {
      errback(err);
      return;
    }
    callback(item);
  });
};

exports.update = function (id, name, callback, errback) {
  Item.findOneAndUpdate(
    { _id: id },
    { name: name },
    { new: true, upsert: true },
    function (err, item) {
      if (err) {
        errback(err);
        return;
      }
      callback(item);
    });
};


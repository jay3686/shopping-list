var mongoose = require('mongoose');

var ItemSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

var Item = mongoose.model('Item', ItemSchema);

if (!ItemSchema.options.toJSON) {
  ItemSchema.options.toJSON = {};
}

ItemSchema.options.toJSON.transform =  function(doc, ret) {
  // Set the id from the retrun object value which will be a string.
  ret.id = ret._id;

  delete ret._id;
  delete ret.__v;
};


module.exports = Item;
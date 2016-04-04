var Storage = function() {
  this.items = [];
  this.id = 0;

  this.add('Broad beans');
  this.add('Tomatoes');
  this.add('Peppers');
};

Storage.prototype.add = function(name) {
  var item = {name: name, id: this.id};
  this.items.push(item);
  this.id += 1;
  return item;
};

Storage.prototype.remove = function(itemId){
  for(var x = 0; x < this.items.length; x++) {
    var currentItem = this.items[x];
    if(currentItem.id === itemId) {
      var matchedItem = this.items[x];
      // overwrite location of matched item in array with last item and
      // then pop the last item off of array.
      this.items[x] = this.items[this.items.length - 1];
      this.items.pop();
      return matchedItem;
    }
  }
  return;
};

module.exports = Storage;

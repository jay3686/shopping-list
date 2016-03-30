var Storage = require("../storage.js");
var tape = require("tape");

var defaults = [{
  id: 0,
  name: 'Broad beans'
}, {
  id: 1,
  name: 'Tomatoes'
}, {
  id: 2,
  name: 'Peppers'
}];

tape.test("storage has default values", function(t){
  var storage = new Storage();
  t.deepEqual(storage.items, defaults);
  t.end();
});

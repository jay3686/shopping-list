var bodyParser = require('body-parser');
var express = require('express');
var Storage = require("./storage.js");

var storage = new Storage();

var app = express();
app.use(express.static('public'));
var jsonParser = bodyParser.json();

app.get('/items', function(req, res) {
  res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
  if (!req.body || !req.body.name) {
    return res.status(400).json({error: 'Invalid item body'});
  }

  var item = storage.add(req.body.name);

  res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
  var itemId = parseInt(req.params.id);
  if(isNaN(itemId)) {
    return res.status(400).json({error: 'Invalid item id'});
  }

  var matchedItem = storage.remove(itemId);
  if (matchedItem){
    return res.status(200).json(matchedItem);
  }

  return res.status('404').json({error: 'Not Found'});
});


app.put('/items/:id', jsonParser, function(req, res) {
  var itemId = parseInt(req.params.id);
  if(isNaN(itemId)) {
    return res.status(400).json({error: 'Invalid item id'});
  }
  var name = req.body && req.body.name;
  if(typeof name !== "string" || name.trim() === '') {
    return res.status(400).json({error: 'Invalid item name'});
  }

  for(var x = 0; x < storage.items.length; x++) {
    var currentItem = storage.items[x];
    if(currentItem.id === itemId) {
      currentItem.name = name;
      return res.status(200).json(currentItem);
    }
  }

    //max sure there are no future collisions
  if(storage.id <= itemId) {
    storage.id = itemId + 1;
  }
  var item = {name: name, id: itemId};
  storage.items.push(item);
  return res.status(201).json(item);
});

module.exports = app;

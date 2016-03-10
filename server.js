var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
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

    for(var x = 0; x < storage.items.length; x++) {
        var currentItem = storage.items[x];
        if(currentItem.id === itemId) {
            var matchedItem = storage.items[x];
            // overwrite location of matched item in array with last item and
            // then pop the last item off of array.
            storage.items[x] = storage.items[storage.items.length - 1];
            storage.items.pop();
            
            return res.status(200).json(matchedItem);
        }
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


app.listen(process.env.PORT || 8080);
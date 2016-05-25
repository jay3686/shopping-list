var express = require('express');
var Item = require('../services/item');
var router = express.Router();

router.get('/items', function (req, res) {
  Item.list(function (items) {
    res.json(items);
  }, function (err) {
    res.status(500).json(err);
  });
});

router.post('/items', function (req, res) {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: 'Invalid item body' });
  }

  Item.save(req.body.name, function (item) {
    res.status(201).json(item);
  }, function (err) {
    res.status(500).json(err);
  });
});

router.delete('/items/:id', function (req, res) {
  Item.delete(req.params.id, function (item) {
    if (item == null) {
      return res.status(404).json({ error: 'Not Found' });
    }
    return res.status(200).json(item);
  }, function (err) {
    console.log(err);
    res.status(500).json(err); 
  });
});


router.put('/items/:id', function (req, res) {
  var name = req.body && req.body.name;
  if (typeof name !== "string" || name.trim() === '') {
    return res.status(400).json({ error: 'Invalid item name' });
  }

  Item.update(req.params.id, name, function (item) {
    return res.status(200).json(item);
  }, function (err) {
    res.status(500).json(err); 
  });
});



module.exports = router;

var request = require("supertest");
var server = require("../server.js");
var Item = require('../models/item');
var seed = require('../db/seed');
var tape = require("tape");
var mongoose = require('mongoose');
global.environment = 'test';

var fixture_id;

tape.test("before", function (t) {
  seed.run(function (data) {
    fixture_id = data.id;
    t.end();
  }, function (err) {
    t.fail('test data setup failed');
  });
});

// should list items on get
tape.test("GET: items", function (t){
  request(server)
  .get("/items")
  .expect(200)
  .expect('Content-Type', /json/)
  .expect(function (res){
    t.equals(typeof res.body, 'object',
      'response body should be an object');
    t.equals(res.body.length, 3,
      'response body should have 3 items');
    t.equals(typeof res.body[0], 'object',
      'items should be an object');
    t.not(res.body[0].id, undefined,
      'item id should be defined');
    t.not(res.body[0].name, undefined,
      'item name should be defined');
    t.equals(typeof res.body[0].id, 'string',
      'item id should be a string');
    t.equals(typeof res.body[0].name, 'string',
      'item name should be a string');
    t.equals(res.body[0].name, 'Broad beans',
      'the first item should be "Broad Beans"');
    t.equals(res.body[1].name, 'Tomatoes',
      'the second item should be "Tomatoes"');
    t.equals(res.body[2].name, 'Peppers',
      'the third item should be "Peppers"');
  })
  .end(t.end); // <-- We have to call SuperTest.end() to shut down the server,
  // We pass it t.end() so that tape knows we're done with this async test
});

// should add an item on post
tape.test("POST: items", function (t){
  request(server)
  .post("/items")
  .send({ name: "Toast" })
  .expect(201)
  .expect('Content-Type', /json/)
  .expect(function (res){
    t.equals(typeof res.body, 'object',
      'response body should be an object');
    t.not(res.body.id, undefined,
      'item id should be defined');
    t.not(res.body.name, undefined,
      'item name should be defined');
    t.equals(typeof res.body.id, 'string',
      'item id should be a string');
    t.equals(typeof res.body.name, 'string',
      'item name should be a string');
    t.equals(res.body.name, "Toast",
      'item name should be Toast');
  })
  .end(t.end);
});

tape.test("POST: items - empty body", function (t){
  request(server)
  .post("/items")
  .send(undefined)
  .expect(400)
  .expect('Content-Type', /json/)
  .expect(function (res){
    t.deepEqual(res.body.error, "Invalid item body",
      'trying to create with empty body should return error');
  })
  .end(t.end);
});

// should edit an item on put
tape.test("PUT: items", function (t){
  request(server)
  .put("/items/" + fixture_id)
  .send({ name: "Milk" })
  .expect(200)
  .expect('Content-Type', /json/)
  .expect(function (res){
    t.equals(typeof res.body, 'object',
      'response body should be an object');
    t.not(res.body.id, undefined,
      'item id should be defined');
    t.not(res.body.name, undefined,
      'item name should be defined');
    t.equals(typeof res.body.id, 'string',
      'item id should be a string');
    t.equals(typeof res.body.name, 'string',
      'item name should be a string');
    t.equals(res.body.name, "Milk",
      'item name should be Milk');
  })
  .end(t.end);
});

// create an item on put if id not exists
tape.test("PUT: items - non existing item", function (t){
  request(server)
  .put("/items/feedca75deadbeef0f00d001")
  .send({ name: "New Milk" })
  .expect(200)
  .expect('Content-Type', /json/)
  .expect(function (res){
    t.equals(typeof res.body, 'object',
      'response body should be an object');
    t.not(res.body.id, undefined,
      'item id should be defined');
    t.not(res.body.name, undefined,
      'item name should be defined');
    t.equals(typeof res.body.id, 'string',
      'item id should be a string');
    t.equals(typeof res.body.name, 'string',
      'item name should be a string');
    t.equals(res.body.id, 'feedca75deadbeef0f00d001',
      'item id should be feedca75deadbeef0f00d001');
    t.equals(res.body.name, "New Milk",
      'item name should be New Milk');
  })
  .end(t.end);
});

tape.test("DELETE: items", function (t){
  request(server)
  .delete("/items/" + fixture_id)
  .expect(200)
  .expect('Content-Type', /json/)
  .expect(function (res){
    t.equals(typeof res.body, 'object',
      'response body should be an object');
    t.not(res.body.id, undefined,
      'item id should be defined');
    t.not(res.body.name, undefined,
      'item name should be defined');
    t.equals(typeof res.body.id, 'string',
      'item id should be a string');
    t.equals(typeof res.body.name, 'string',
      'item name should be a string');
    t.equals(res.body.id, fixture_id,
      'item id should be ' + fixture_id);
    t.equals(res.body.name, "Milk",
      'item name should be Milk');
  })
  .end(t.end);
});

//  non existing item
tape.test("DELETE: items - non existing item", function (t){
  request(server)
  .delete("/items/" + fixture_id)
  .expect(404)
  .expect('Content-Type', /json/)
  .expect(function (res){
    t.deepEqual(res.body.error, "Not Found",
      'deleting an invalid item should fail');
  })
  .end(t.end);
});


tape.test("after", function (t) {
  Item.remove(function (err, data) {
    if (err) {
      t.fail('test data teardown failed');
    }
    mongoose.disconnect();
    t.end();
  });
});

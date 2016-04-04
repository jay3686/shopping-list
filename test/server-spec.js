var request = require("supertest");
var server = require("../server.js");
var tape = require("tape");

// should list items on get
tape.test("GET: items", function(t){
  request(server)
  .get("/items")
  .expect(200)
  .expect('Content-Type', /json/)
  .expect(function(res){
    t.equals(typeof res.body, 'object');
    t.equals(res.body.length, 3);
    t.equals(typeof res.body[0], 'object');
    t.not(res.body[0].id, undefined);
    t.not(res.body[0].name, undefined);
    t.equals(typeof res.body[0].id, 'number');
    t.equals(typeof res.body[0].name, 'string');
    t.equals(res.body[0].name, 'Broad beans');
    t.equals(res.body[1].name, 'Tomatoes');
    t.equals(res.body[2].name, 'Peppers');
  }).end(t.end); //<-- We have to call SuperTest.end() to shut down the server,
  // We pass it t.end() so that tape knows we're done with this async test
});

// should add an item on post
tape.test("POST: items", function(t){
  request(server)
  .post("/items")
  .send({name:"Toast"})
  .expect(201)
  .expect('Content-Type', /json/)
  .expect(function(res){
    t.equals(typeof res.body, 'object');
    t.not(res.body.id, undefined);
    t.not(res.body.name, undefined);
    t.equals(typeof res.body.id, 'number');
    t.equals(typeof res.body.name, 'string');
    t.equals(res.body.name, "Toast");
  }).end(t.end);
});

tape.test("POST: items - empty body", function(t){
  request(server)
  .post("/items")
  .send(undefined)
  .expect(400)
  .expect('Content-Type', /json/)
  .expect(function(res){
    t.deepEqual(res.body.error, "Invalid item body");
  }).end(t.end);
});

// should edit an item on put
tape.test("PUT: items", function(t){
  request(server)
  .put("/items/1")
  .send({name: "Milk"})
  .expect(200)
  .expect('Content-Type', /json/)
  .expect(function(res){
    t.equals(typeof res.body, 'object');
    t.not(res.body.id, undefined);
    t.not(res.body.name, undefined);
    t.equals(typeof res.body.id, 'number');
    t.equals(typeof res.body.name, 'string');
    t.equals(res.body.name, "Milk");
  }).end(t.end);
});

// create an item on put if id not exists
tape.test("PUT: items - non existing item", function(t){
  request(server)
  .put("/items/7")
  .send({name: "New Milk"})
  .expect(201)
  .expect('Content-Type', /json/)
  .expect(function(res){
    t.equals(typeof res.body, 'object');
    t.not(res.body.id, undefined);
    t.not(res.body.name, undefined);
    t.equals(typeof res.body.id, 'number');
    t.equals(typeof res.body.name, 'string');
    t.equals(res.body.id, 7);
    t.equals(res.body.name, "New Milk");
  }).end(t.end);
});

// TODO:  the ordering of these tests bother me.
// Is it dependent on the test above finishing in time for the item to exist?
//  it('should delete an item on delete');
tape.test("DELETE: items", function(t){
  request(server)
  .delete("/items/7")
  .expect(200)
  .expect('Content-Type', /json/)
  .expect(function(res){
    t.equals(typeof res.body, 'object');
    t.not(res.body.id, undefined);
    t.not(res.body.name, undefined);
    t.equals(typeof res.body.id, 'number');
    t.equals(typeof res.body.name, 'string');
    t.equals(res.body.id, 7);
    t.equals(res.body.name, "New Milk");
  }).end(t.end);
});

//  non existing item
tape.test("DELETE: items - non existing item", function(t){
  request(server)
  .delete("/items/9")
  .expect(404)
  .expect('Content-Type', /json/)
  .expect(function(res){
    t.deepEqual(res.body.error, "Not Found");
  }).end(t.end);
});

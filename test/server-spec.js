var request = require("supertest");
var server = require("../server.js");
var tape = require("tape");

tape.test("GET: items", function(t){
  request(server)
  .get("/items")
  .expect(200)
  .expect(function(res){
    t.equals(res.body.length, 3);
  }).end(t.end); //<-- We have to call SuperTest.end() to shut down the server,
  // We pass it t.end() so that tape knows we're done with this async test
});

tape.test("POST: items", function(t){
  request(server)
  .post("/items")
  .send({name:"Toast"})
  .expect(201)
  .expect(function(res){
    t.deepEqual(res.body.name, "Toast");
  }).end(t.end);
});

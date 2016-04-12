var app = require("./server.js");

var port = process.env.PORT || 3033;

app.listen(port, function() {
  console.log('Listening on port ' + port);
});
var
  http   = require('http')
;


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');

  console.log(req.body);
})
.listen(3001, '127.0.0.1');
var express = require('express'),
    server  = express(),
    morgan  = require('morgan'),
    PORT    = process.env.PORT || 3000;

server.use(morgan('short'));
server.use(express.static('./public'));

server.get('/', function(req, res) {
  res.render('index');
});

server.listen(PORT, function () {
  console.log('SERVER IS UP ON PORT', PORT);
});

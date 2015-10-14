var express          = require('express'),
    server           = express(),
    ejs              = require('ejs'),
    expressLayouts   = require('express-ejs-layouts'),
    morgan           = require('morgan'),
    PORT             = process.env.PORT || 3000,
    OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

    // console.log(OPEN_WEATHER_KEY);

server.set('views', './views');
server.set('view engine', 'ejs');

server.use(morgan('short'));
server.use(express.static('./public'));
server.get('/', function(req, res) {
  console.log("THIS IS HAPPENINGGGGGG", OPEN_WEATHER_KEY);
  res.render('layout.ejs');
});

server.listen(PORT, function () {
  console.log('SERVER IS UP ON PORT', PORT);
});

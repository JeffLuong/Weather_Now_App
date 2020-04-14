const express = require('express');
const server = express();
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const http = require('https');
const PORT = process.env.PORT || 3000;

const defaultOpts = {
  headers: {
    accept: 'application/json',
    'content-type': 'application/json'
  }
};

function getReq(url, options = defaultOpts) {
  return new Promise(function(res, rej) {
    const req = http.get(url, function(_res) {
      const chunks = [];

      _res.on('data', function(chunk) {
        chunks.push(chunk);
      });

      _res.on('end', function() {
        const data = Buffer.concat(chunks);
        res(data.toString());
      });
    }).on('error', function(err) {
      console.log(err);
      rej(err);
    });
    req.end();
  });
}

server.set('views', './views');
server.set('view engine', 'ejs');

server.use(morgan('short'));
server.use(express.static('./public'));

server.get('/api/weather', async function(req, res) {
  try {
    const geo = await getReq('https://freegeoip.app/json/');
    const { latitude: lat, longitude: lon } = JSON.parse(geo);
    const urlKey = 'c4a7a0b1db1f6b2be70ba3d035152ad7';
    const weather = await getReq(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${urlKey}`);
    const { cod, message } = JSON.parse(weather);

    if (cod > 200 && cod < 400) {
      res.status(500).send({
        error: {
          status: 500,
          message
        }
      });
      throw new Error(message);
    }

    if (!res.get('Content-Type')|| res.get('Content-Type') !== 'application/json') {
      res.set('Content-Type', 'application/json');
    }
    res.send(weather);
  } catch(err) {
    console.log(err);
    throw err;
  }
});

server.get('/', function(req, res) {
  res.render('layout.ejs');
});

server.listen(PORT, function() {
  console.log('SERVER IS UP ON PORT', PORT);
});

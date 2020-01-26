var express = require('express');
var app = express();
const cors = require('cors');
app.use(cors());
app.options('*', cors());
var expressWs = require('express-ws')(app);
const PORT = 3000

app.use(function (req, res, next) {
  console.log('middleware');
  req.testing = 'testing';
  return next();
});

app.get('/', function(req, res, next){
  console.log('get route', req.testing);
  res.end();
});

app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
    ws.send(msg)
  });
  console.log('socket', req.testing);
});

app.listen(PORT);

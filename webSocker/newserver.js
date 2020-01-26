var express = require('express');
var app = express();
const cors = require('cors');
app.use(cors());
app.options('*', cors());
var expressWs = require('express-ws')(app);
const PORT = 3000
wsList=[]

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
  save(ws)
  ws.on('message', function(msg) {
    console.log(msg);
    ws.send(msg);
    wsList.forEach(function each(client) {
      if (client.readyState==1) {
        client.send(msg);
      }
    });
  });
  console.log('socket', req.testing);
});

function save(ws) {
  console.log(wsList.include(ws))
  if(!wsList.include(ws)){
    wsList.push(ws)
  }
}

app.listen(PORT);

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
    wsList.forEach(function each(ws) {
      if (ws.readyState==1) {
        ws.send(msg);
      }else{
        deleteWS(ws)
      }
    });
  });
  console.log('socket', req.testing);
});

function save(ws) {
  console.log("save");
  if(!wsList.includes(ws)){
    wsList.push(ws)
  }
  printList(wsList)
}

function deleteWS(ws) {
  console.log("delete");
  const index = wsList.indexOf(ws);
  if (index > -1) {
    wsList.splice(index, 1);
  }
  printList(wsList)
}

function printList(wsList) {
  wsList.forEach((item, i) => {
    console.log(item.readyState+" : "+i);
  });
}

app.listen(PORT);

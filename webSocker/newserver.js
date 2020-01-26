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
    list=[]
    wsList.forEach(function(client) {
      if (client.readyState==1) {
        console.log(msg);
        client.send(msg);
      }else{
        list.push(client)
      }
    });
    deleteWS(list)
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

function deleteWS(list) {
  list.forEach((ws) => {
    const index = wsList.indexOf(ws);
    if (index > -1) {
      console.log("deleting...");
      wsList.splice(index, 1);
    }
  });
  printList(wsList)
}

function printList(wsList) {
  wsList.forEach((item, i) => {
    console.log(item.readyState+" : "+i);
  });
}

app.listen(PORT);

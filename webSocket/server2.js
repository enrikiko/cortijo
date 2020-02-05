const express = require('express');
const cors = require('cors');
const websocket = require('express-ws');
var app = express().use(cors());
var expressWs = websocket(app);
const PORT = 3000
wsList=[]
app.ws('/', function(ws, res) {
  save(ws)
  ws.on('open', function open() {
  ws.send('something');
  console.log('open')
});
  ws.on('message', function(msg) {
    console.log('message: ', msg);
    list=[]
    wsList.forEach(function(client) {
      if (client.readyState==1) {
        client.send(msg);
      }else{
        list.push(client)
      }
    });
    deleteWS(list)
    console.log("List length: "+wsList.length)
  });
  //
  ws.on("connection", (x)=>{console.log(x)})
  //
  ws.on('close', function close(ws) {
  console.log('disconnected');
  console.log(ws);
  });
  //res.setHeader('Access-Control-Allow-Origin', 'http://88.7.67.229:8300');
  //console.log(res);
});

function save(ws) {
  //console.log("save");
  if(!wsList.includes(ws)){
    console.log("new user add to list")
    wsList.push(ws)
  }
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
    console.log("{Item:"+i+"Status:"+item.readyState+"}");
  });
}

app.listen(PORT);

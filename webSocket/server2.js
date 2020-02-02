const express = require('express');
const cors = require('cors');
const websocket = require('express-ws');
var app = express().use(cors());
var expressWs = websocket(app);
const PORT = 3000
wsList=[]

app.ws('/', function(ws, req) {
  ws.setHeader('Access-Control-Allow-Origin', 'http://localhost:8200');
  save(ws)
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

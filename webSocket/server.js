var express = require('express')
var cors = require('cors')
var app = express()
var expressWs = require('express-ws')(app);
const PORT = 3000
wsList=[]

app.options('*', cors())

app.ws('/', cors(), function(ws, req) {
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

app.listen(PORT, function () {
  console.log('CORS-enabled web server listening on port '+PORT)
})

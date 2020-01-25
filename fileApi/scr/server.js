const version = "1.0.0";
const startDate = Date();
const express = require("express");
const app = express();
const fs = require('fs')
const Busboy = require('busboy'),
const path = require('path');
app.use(bodyParser.json());
var http = require('http').Server(app);
var io = http;

app.get(){}

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
})

app.post('/fileupload', function (req, res) {
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      var saveTo = path.join(__dirname, 'uploads/' + filename);
      file.pipe(fs.createWriteStream(saveTo));
    });
    busboy.on('finish', function() {
      res.writeHead(200, { 'Connection': 'close' });
      res.end("That's all folks!");
    });

    return req.pipe(busboy);
});

http.listen(3000, function () {
  console.log('Servidor activo en http://localhost:3000');
})

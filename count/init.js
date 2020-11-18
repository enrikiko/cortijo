const express = require('express')
const app = express()
let count = 38091634
app.enable('trust proxy');
app.get('/count', function (req, res) {
  res.status(200).json({"index": ++count})
  console.log({"index": count, "time": new Date().toLocaleString({timeZone: 'Europe/Spain'})});
})

app.listen(3000)

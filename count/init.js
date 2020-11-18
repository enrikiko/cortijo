const express = require('express')
const app = express()
let count = 38091640
let lastcount = count
let speed = 0
app.enable('trust proxy');
app.get('/count', function (req, res) {
  res.status(200).json({"index": --count})
  console.log({"index": count, "time": new Date().toLocaleString({timeZone: 'Europe/Spain'}), "speed": speed});
})

function startTime(){
    setTimeout(function(){
            speed = lastcount - count
            lastcount = count
            startTime()
            console.log(speed);
            console.log('setTimeout');
        }, 10000);
}
startTime()
app.listen(3000)

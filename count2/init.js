const express = require('express')
const app = express()
let count = 38091640
let lastcount = count
let speed = 0
app.enable('trust proxy');
app.get('/count', function (req, res) {
  res.status(200).json({"index": ++count})
  console.log({"index": count, "time": new Date().toLocaleString({timeZone: 'Europe/Spain'}), "speed": speed+"ps"});
})

function startTime(){
    setTimeout(function(){
            speed = lastcount - count
            lastcount = count
            startTime()
        }, 1000);
}
<<<<<<< HEAD

startTime()

=======
startTime()
>>>>>>> b358c78cc60d904417909b9da8a1d871e0229150
app.listen(3000)

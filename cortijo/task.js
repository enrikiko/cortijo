const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect(mongo_db, { useNewUrlParser: true, useUnifiedTopology: true});
db.on('error',function(){
logs.error("Error to connect to MongoDB Task");
});
db.once('open', function() {
logs.log("Connected to  MongoDB Task");
});
//
const taskSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true
  },
});
//
let myTask = mongoose.model('Task', taskSchema);
//
module.exports = {
  newTask: async(name, description) => {

      let task = await myTask.find({"name":name})
      if (task.length <= 0){
        let task = new myTask(
          {
            time: new Date().getTime(),
            name: name,
            description: description,
            status: "todo"
          });
        task.save(function(err) {
          if (err) throw err;
        });
        return true;
    } else {
      return false;
    }
  },
  getTasks: async (status) => {return await myTask.find({"status":status})},
  //
  updateTask: async (name, status) => {
    let currentTask = myTask.find({"name":name},function(err, result) {
      if (err) throw err
      if(result){
        result.status = status
        result.save()
      }
    });
    return true;
  },
}
//

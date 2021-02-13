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
// let myTask = mongoose.model('Task', taskSchema);
async function checkTask(tenant, name, description) {
  let myTask = mongoose.model(tenant+'_Task', taskSchema);
  let isTask = await myTask.find({"name":name})
  if (isTask.length <= 0){
    return true
  }else {
    return false
  }
}
async function verifyTask(tenant, name, description) {
  if ( name!=null && description!=null && await checkTask(tenant, name, description) ){
    return true
  }else {
    return false
  }
}
//
module.exports = {
  newTask: async(tenant, name, description) => {
    let myTask = mongoose.model(tenant+'_Task', taskSchema);
    if ( await verifyTask(tenant, name, description) ){
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
  getTasks: async (tenant, status) => {
    let myTask = mongoose.model(tenant+'_Task', taskSchema);
    return await myTask.find({"status":status})},
  //
  updateTask: async (tenant, name, status) => {
    let myTask = mongoose.model(tenant+'_Task', taskSchema);
    return myTask.findOne({"name":name},function(err, result) {
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

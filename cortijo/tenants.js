const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect( mongo_db + '/tenants', { useNewUrlParser: true, useUnifiedTopology: true } );

db.on('error',function(){
logs.error("Error to connect to Mongo ");
});

db.once('open', function() {
logs.log("Connected to MongoDB");
});

// definicion de esquema del artículo
const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// definicion del modelo de dato de nuevos articulos
let myTenants = mongoose.model('Tenants', tenantSchema);

async function checkTenant(name) {
  let isTenantNameAvaliable = await myTenants.find({"name":name})
  if ( isTenantNameAvaliable.length <= 0 ){
    return true
  }else {
    return false
  }
}

module.exports = {

   getTenants: () => { return myTenants.find() },

   createTenant: (tenant) => {
     if(checkTenant(name)){
       let newTenant = new myTenants(
         {
           name: tenant
         });
       newTenant.save( function(err, result) {
         if (err) throw err;
         if(result) {
           console.log('Tenant %t have been create', tenant)
           logs.log(result);
         }
       });
       return true
     }else {
       return false
     }

     }

}

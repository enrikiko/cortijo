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

module.exports = {

   getTenants: () => { return myTenants.find() },

   createTenant: (tenant) => {
     let newTenant = new myTenants(
       {
         name: tenant
       });
       newTenant.save( function(err, result) {
         if (err) throw err;
         if(result) {
           console.log('Tenant % have been create', tenant)
           logs.log(result);
         }
       });
     }

}

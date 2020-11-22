const mongoose = require('mongoose');
const logs = require('./logs');
const conf_map = require('./url');
const mongo_db = conf_map.get("db_url");
const db = mongoose.connection;
mongoose.connect( mongo_db, { useNewUrlParser: true, useUnifiedTopology: true } );

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
  },
  password: {
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

async function getTenant(tenant, password){
   return myTenants.find({user: tenant, password: password})
}

module.exports = {

  checkTenant: checkTenant,

   getTenants: async() => {
     tenantList = []
     tenants = await myTenants.find()
     tenants.forEach((tenant) => {
       tenantList.push(tenant.name)
     });

     return tenantList
   },

   createTenant: async (tenant, password) => {
     if( await checkTenant(name) ){
       let newTenant = new myTenants(
         {
           name: tenant,
           password: password
         });
       newTenant.save( function(err, result) {
         if (err) throw err;
         if(result) {
           console.log('Tenant '+tenant+' have been create')
           logs.log(result);
         }
       });
       return true
     }else {
       return false
     }
   },

   verifyTenant: async(tenant, password) => {
     var tenantList = await getTenant(tenant, password)
     if (tenantList.length > 0) {
       return false
     }else { return false }
   },

   createTenantPassword: () => {
     var length = 16
     var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§±@#$!$%^&*()_=+"
     var retVal = ""
     for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    }

}

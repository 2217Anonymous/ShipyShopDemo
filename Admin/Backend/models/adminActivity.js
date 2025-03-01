const mongoose = require('mongoose')

const ytivitcAnimda_schema = new mongoose.Schema({
    adminId              : { type : String , index : true},
    activityType         : { type : String , index : true},
    activityDescription  : { type : String },
    ipAddress            : { type : String },
    browserdetails       : { type : String },
    os                   : { type : String },
    referanceID          : { type : String },
    createdAt            : { type : Date, default : Date.now() , index : true } ,
    updatedAt            : { type : Date }
},{versionKey : false})

module.exports = mongoose.model('adminActivity',ytivitcAnimda_schema,'adminActivity')
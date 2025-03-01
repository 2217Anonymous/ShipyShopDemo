const adminActivity    = require('../models/adminActivity')
const { sendJson } = require('./sendResponse')

exports.adminActivity = async(adminId , activityType , activityDescription , ipAddress , browserdetails , os ,referanceID)=>{
    try{
        const newActivity = new adminActivity({
            adminId              : adminId ,
            activityType         : activityType ,
            activityDescription  : activityDescription ,
            ipAddress            : ipAddress ,
            browserdetails       : browserdetails,
            os                   : os ,
            referanceID          : referanceID
        })
        await newActivity.save(async function(err , doc){
            if(err){
                let returnData = { status : false, text : 'connection error' };
                return sendJson(returnData,res)
            }
        })
    } catch(err) {
        let returnData = { status : false, text : err.message };
        return sendJson(returnData,res)
    }    
}

const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    customerId: {
        type:Number,
        required: false,
      },
    title: {
      type:String,
      required: false,
    },
    descryption: {
      type: String,
      required: false,
    },
    name: {
        type: String,
        required: false,
      }, 
    emailId: {
        type: String,
        required: false,
      },
    reply    : [{ replyId   : {type : Number} ,
        from      : {type : String , enum : ['adminToUser' , 'userToAdmin']} , 
        message   : {type : String} , 
        repliedAt : {type : Date} }] ,

    ticketStatus  : { type : Number , default : 0 , enum :[0,1] , index : true} , // 0 - active ,1 - closed 
    readStatus    : { type : Number , default : 0 , enum :[0,1] , index : true } ,// 0 - unread , 1 - read 

  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Support", supportSchema,"Support");
module.exports = Rating;



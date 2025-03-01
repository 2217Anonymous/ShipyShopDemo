const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    countryCode : {
      type : String
    },
    status: {
      type: String,
      required: false,
      default: "Inactive",
      enum: ["Active", "Inactive","Disable","Blocked"],
    },
    password: {
      type: String,
      required: false,
      // default: bcrypt.hashSync("12345678"),
    },
    pattern: {
      type: String,
      required: false,
    },
    otp : {
      type: String,
      required: false,
      // default: bcrypt.hashSync("123456"),
    },
    otpExp : {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      required: true,
      default: "Seller",

    },
    joiningDate: {
      type: Date,
      required: false,
    },
    GSTINnumber : {
      type: String,
    },
    OTPID : {
      type : String
    },
    AccLInkExpiry : {
      type :Date
    },
    PassLInkExpiry : {
      type :Date
    },
    profileStatus : {
      type:Number,enum : [0,1],default : 0
    },
    addressDetails: {

                address       : {type : String},
                pincode       : {type : String},
                city          : {type : String},
                state         : {type : String},
                landmark      : {type : String},
                altermobile_no: {type : String},
                status        : {type : Number },   //0-uploaded , 1 - approved , 2 -rejected
                reason        : {type : String},

    },
    bussinessDetails: {
                gstInnumber     : {type : String},
                businessName    : {type : String},
                businessAddress : {type : String},
                PanNumber       : {type : String},
                status          : {type : Number},   //0-uploaded , 1 - approved , 2 -rejected
                businesstype    : {type : String},
                reason          : {type : String},
    },
    bankDetails : {
                holdername      : {type : String},
                accNumber       : {type : String},
                ifscCode        : {type : String},
                bankName        : {type : String},
                state           : {type : String},
                city            : {type : String},
                branch          : {type : String},
                status          : {type : Number},   //0-uploaded , 1 - approved , 2 -rejected
                reason          : {type : String},
    },
    signature : {
                signatureImage  :{type : String},
                status          : {type : Number, default : 0 },   //0-uploaded , 1 - approved , 2 -rejected
                reason          : {type : String},

    }
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Seller", adminSchema.plugin(AutoIncrement, {
  inc_field: 'seller_id',
  start_seq: 1,
}));

module.exports = Admin;

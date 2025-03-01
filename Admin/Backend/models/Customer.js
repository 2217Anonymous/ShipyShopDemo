const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);
const customerSchema = new mongoose.Schema(
  {
    customer_id: {
      type: Number,
      index: true
    },
    name: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      default: '',
    },
    phoneno: {
      type: String,
      default: '',
    },
    lastname: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
      enum: ['', 'men', 'women', 'Transgender']
    },
    image: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      required: false,
    },
    otpTime: {
      type: Date,
      required: false
    },
    addressDetails: {
      type: Array
    }
    ,
    carts: [],
    referralDetails: {
      referredBy: { type: String },
      referredAmount: { type: Number },
      referredUseAmount: { type: Number },
    },
    userStatus : { type : Number,default : 1,enum : [0,1]}, //0-inactive 1- active
    createdAt: { type: Date, default: Date.now() },
    uppdateAt: { type: Date }

  },

  {
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false }
  }
);

const Customer = mongoose.model("Customer", customerSchema.plugin(AutoIncrement, {
  inc_field: 'customer_id',
  start_seq: 1,
}));

module.exports = Customer;

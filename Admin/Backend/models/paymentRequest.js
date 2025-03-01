const mongoose = require("mongoose");

const paymentRequestSchema = new mongoose.Schema(
  {
    sellerId: {
      type: Number,
      required: true,
    },
    sellerName: {
      type: String,
      required: false,
    },
    amountValue: {
      type: Number,
      required: false,
    },
    paidAmount : {
        type : Number,
    },
    transactionId : {
        type : String

    },
    status: {
      type: Number,   // 0 - pending , 1 - Completed , 2 - rejected
      default: 0
    },
    reason: {
      type: String,
      required: false,
    },
    orderId:[]

  },
  {
    timestamps: true,
  }
);

const paymentRequest = mongoose.model('paymentRequest', paymentRequestSchema,"paymentRequest");
module.exports = paymentRequest;
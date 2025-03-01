const mongoose = require("mongoose");

const sellerRequestSchema = new mongoose.Schema(
  {
    sellerId: {
      type: Number,
      required: true,
    },
    sellerName: {
      type: String,
      required: false,
    },
    oldValue: {
      type: String,
      required: false,
    },
    oldValueInObject: {
      type: Object
    },
    value: {
      type: String,
      required: false,
    },
    valueInObject: {
      type: Object
    },
    type: {
      type: String,
      required: false,
    },
    status: {
      type: Number,   // 0 - pending , 1 - approved , 2 - rejected
      required: false,
    },
    reason: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const sellerRequest = mongoose.model('sellerRequest', sellerRequestSchema);
module.exports = sellerRequest;
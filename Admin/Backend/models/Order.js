const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invoice: {
      type: Number,
      required: false,
    },
    cart: [{}],   //if return the product     returnStatus 0- means return pending ,1 -  means return approved , 2- return rejected
                                              //returnPickstatus  0-means Pending   ,1 - pickup completed
   user_info: {
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      contact: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    referrelAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Processing', 'Pending', 'Packed', 'Shipped', 'Delivered', 'Cancel','Return-exchange','Return-Refund'],
    },
    trackingOrderId: {
      type: String,

    },
    paymentDetails : {
      razorpay_payment_id : {type : String},
      razorpay_order_id   : {type : String},
      razorpay_signature  : {type : String},

    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  'Order',
  orderSchema.plugin(AutoIncrement, {
    inc_field: 'invoice',
    start_seq: 10000,
  })
);
module.exports = Order;

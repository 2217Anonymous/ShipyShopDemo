const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: false,
    },
    sku: {
      type: String,
      required: false,
    },
    barcode: {
      type: String,
      required: false,
    },
    title: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: false,
    },
    slug: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: {
      type: Array,
      required: false,
    },
    resizeImage : [],
    stock: {
      type: Number,
      required: false,
    },

    sales: {
      type: Number,
      required: false,
    },

    tag: [String],
    prices: {
      originalPrice: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
        required: false,
      },
    },
    variants: [{}],
    isCombination: {
      type: Boolean,
      required: true,
    },
    view: { type: Number, default: 0 },
    status: {
      type: String,
      default: "show",
      enum: ["show", "hide"],
    },
    ratings: {
      type: Number,
      default: 0
    },
    returnValid: {
      type: Number,
      default: 0
    },
    info: { },
    shippingCost: { type: Number, default: 0 },
    returnPolicy : {type : Number ,default : 0, enum :[0,1]} , //0 - no , 1 - yes
    shortDescription  : { 
      type: Object,
      required: true
    },
    type             : { 
      type: Object,
    },
    brand             : { 
      type: Object,
    }, 
    material          : { 
      type: Object,
    },
    attributeArray : [],
    insertById: {
      type: Number,
      ref: "sellers",
      default : 0
    },
    insertByName: {
      type: String,
      ref: "sellers",
    },
    insertByRole: {
      type: String,
      default : "Admin"

    },
    commissionFee : {
      type : Number,
      default : 0
    },
    addType : {
      type :String
    },
    designcode : {
      type :String
    },
    aprovalStatus :{      // 0 - pending 1- approved  2-rejected
      type :Number,
      default :0
    }
  },
  {
    timestamps: true,
  }
);

// module.exports = productSchema;

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

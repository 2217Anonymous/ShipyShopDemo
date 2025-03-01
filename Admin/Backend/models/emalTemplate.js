const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {

    templateName: {
      type:String,
      required: false,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
        type: String,
        required: false,
    },
    status: {
        type: Number,
        required: false,
    },

  },
  {
    timestamps: true,
  }
);

const emailTemplate = mongoose.model("emailTemplate", templateSchema, "emailTemplate");
module.exports = emailTemplate;



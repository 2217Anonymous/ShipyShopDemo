const mongoose = require("mongoose");

const flacksSchema = new mongoose.Schema(
  {

    tableName: {
      type:String,
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

const flacksTable = mongoose.model("flacks", flacksSchema, "flacks");
module.exports = flacksTable;



const mongoose = require('mongoose');


const commisionSchema = new mongoose.Schema({
    range: { 
        min: {type : Number},
        max: {type : Number},
    },

    fbf: { type: Number },
    nfbf: { type: Number },

},{
    timestamps : true
})


const Commission = mongoose.model("Commission", commisionSchema, "Commission");
module.exports = Commission;
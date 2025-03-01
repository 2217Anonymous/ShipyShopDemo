const mongoose = require("mongoose");

const RefAmountSchema = new mongoose.Schema(
    {
        Customer_id: {
            type: String,
        }, 
         Customer_name: {
            type: String,
        },
        From_name: {
            type: String,
        },
        type: {
            type: Number,
            required: false,   //0-Initial referral Income,1-Withdraw ticket pending,2-Withdraw ticket approved and amount moved ,3-Withdraw titcket reject
        },
        amount: {
            type: Number,
            required: false,
        },
        Refamount: {
            type: Number,
            required: false,
        },
        WithdrawPer:{
                type: Number,
                required: false,
        },
        Status: {
            type: Number,
            required: false,
        },
        reason: {
            type: String,
            required: false,
        },
        From: {
            type: String,
        }

    },
    {
        timestamps: true,
    }
);

const flacksTable = mongoose.model("RefAmount", RefAmountSchema, "RefAmount");
module.exports = flacksTable;



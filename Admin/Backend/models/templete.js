const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);


const templeteSchema = new mongoose.Schema({
  templeteId: { type: Number, index: true },
  templeteImage: { type: String, },
  discription: { type: String, },
  categort: { type: String, },
  tittle: { type: String },
  templeteLink: { type: String },
  status: { type: String, default: 'show', enum: ['hide', 'show'] },//0-hide 1-show
  deleteStatus: { type: Number, default: 0, enum: [0, 1] },//0-not delete , 1-delete  
  templetetype: { type: String, default: '',enum:['homePage-1','homePage-2','homePage-3','homePage-4'] },
  createAt: { type: Date, default: Date.now() },
  updateAt: { type: Date }
})


const templete = mongoose.model("templete", templeteSchema.plugin(AutoIncrement, {
  inc_field: 'templeteId',
  start_seq: 1,
}), "templete");
module.exports = templete;
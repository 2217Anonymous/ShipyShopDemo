const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const blogSchema = new mongoose.Schema({
    blogId: { type: Number },
    blogContent: { type: String, default: '' },
    blogTittle: { type: Number, index: true },
    blogImage: { type: Number },
    blogComment: [],
    reaction: {
        like: { type: Number, default: 0 },
        Dislike: { type: Number, default: 0 },
    },
    status: { type: Number, default: 1, enum: [0, 1] },//0-hide 1-show
    deleteStatus: { type: Number, default: 1, enum: [0, 1] },//0-not delete 1-delete
    blogdiscription: { type: String, default: '' },
    createAt: { type: Date, default: Date.now() },
    updateAt: { type: Date }
})


module.exports = mongoose.model('blogtbl', blogSchema.plugin(AutoIncrement, {
    inc_field: 'blogId',
    start_seq: 1,
}), 'blogtbl')
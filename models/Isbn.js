const mongoose = require('mongoose');

const IsbnSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    productId:{
        type:String,
        required:true
    },isbn:{
        type:String,
        required:true
    },status:{
        type:String,
        required:true
    },date:{
        type:Date,
        default:Date.now
    }
});

const Isbn = mongoose.model('Isbn', IsbnSchema);

module.exports = Isbn;
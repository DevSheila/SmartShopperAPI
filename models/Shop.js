const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        required:true
    },location:{
        type:String,
        required:true
    },logo:{
        type:String,
        required:true
    },email:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;
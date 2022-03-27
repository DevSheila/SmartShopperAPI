//PRODUCTS Qualities:

// id
// shop id
// shop name
// isbn
// name
// category
// brand
// quantity
// other qualities
//date
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    shopId:{
        type:String,
        required:true
    },shopName:{
        type:String,
        required:true
    }
    // ,isbn:{
    //     type:String,
    //     required:true
    // }
    ,name:{
        type:String,
        required:true
    },category:{
        type:String,
        required:true
    },brand:{
        type:String,
        required:true
    },quantity:{
        type:String,
        required:true
    },price:{
        type:Number,
        required:true
    },otherQualities:{
        type:String,
        required:true
    },productImage:{
        type:String,
        required:true
    },Date:{
        type:Date,
        default:Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
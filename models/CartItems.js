/*
id
product id
isbn
name
brand
quantity
price
image
user email
shop Name
isbn status
date created

*/

const mongoose = require('mongoose');

const CartItemsSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    cartId:{
        type:String,
        required:true
    },productId:{
        type:String,
        required:true
    },isbn:{
        type:String,
        required:true
    },name:{
        type:String,
        required:true
    },brand:{
        type:String,
        required:true
    },quantity:{
        type:String,
        required:true
    },image:{
        type:String,
        required:true
    },price:{
        type:String,
        required:true
    },userEmail:{
        type:String,
        required:true
    },shopName:{
        type:String,
        required:true
    },isbnStatus:{
        type:String,
        required:true
    },dateCreated:{
        type:Date,
        default:Date.now
    }
});

const CartItems = mongoose.model('CartItems', CartItemsSchema);

module.exports = CartItems;

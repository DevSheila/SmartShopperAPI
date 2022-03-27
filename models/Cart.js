const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    status:{
        type:String,
        required:true
    },dateCheckedOut:{
        type:String
    }
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
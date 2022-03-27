
const express= require('express');
const router = express.Router();
const bcrypt= require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const passport=require('passport');
const mongoose = require('mongoose');


//Product Model
const Product =require('../models/Product');
//Isbn Model
const Isbn=require('../models/Isbn');
//Cart
const CartItems=require('../models/CartItems');
const Cart=require('../models/Cart');

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

//Creating a cart
router.post('/newCart',(req,res,next)=>{
    const cart = new Cart({
        _id:new mongoose.Types.ObjectId(), 
        status:req.body.status,
        dateCheckedOut:req.body.dateCheckedOut
    })
   
    //saving cart to database
    cart.save()
        .then((result)=>{
           console.log(result);
        })
        .catch(err=>{
            console.log(err);
        });

    res.status(201).json(cart)
});

//Adding new product to a cart
router.post('/newProduct',(req,res,next)=>{
 
    const cartItem = new CartItems({
        _id:new mongoose.Types.ObjectId(), 
        cartId:req.body.cartId,
        productId:req.body.productId,
        isbn:req.body.isbn,
        name:req.body.name,
        brand:req.body.brand,
        quantity:req.body.quantity,
        price:req.body.price,
        image:req.body.image,
        userEmail:req.body.userEmail,
        shopName:req.body.shopName,
        isbnStatus:req.body.isbnStatus
    });
    //saving product to database
    cartItem.save()
        .then((result)=>{
           console.log(result);
        })
        .catch(err=>{
            console.log(err);
        });

    res.status(201).json(cartItem)
});


//Get By cart ny cart id
router.get('/cartId/:cartId',(req,res,next)=>{
    const cartId = req.params.cartId;
            Cart.find({ _id:cartId }).
                then((carts)=>{
                    res.status(200).json(carts); 

                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({error:err});
                });

})
//Get cart by items by cart  id
router.get('/cartItems/cartId/:cartId',(req,res,next)=>{
    const cartId = req.params.cartId;

            CartItems.find({cartId:cartId}).
                then((products)=>{
                    res.status(200).json(products); 

                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({error:err});
                });

})


module.exports = router;
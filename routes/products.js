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

// status 
// image

//PRODUCT ROUTES
//CREATE
//1.Post
//READ
//->shop id/name
//->product isbn
//->name
//->category
//->brand


//UPDATE
// -Update for each field?
//DELETE
//->delete by isbn

const express= require('express');
const router = express.Router();
const bcrypt= require('bcryptjs');
const flash = require('connect-flash');
const session = require('express-session');
const passport=require('passport');
const mongoose = require('mongoose');
const multer = require('multer');


//defining storage location and file naming convention

const storage = multer.diskStorage({
    //cb is callback
    destination: function(req,file,cb){
        //null is error
        cb(null,'./uploads/');

    },
    filename: function(req,file,cb){
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let seconds = date_ob.getSeconds();
        let finDate=year  + month + date +  hours  + minutes + seconds;

        cb(null,finDate +file.originalname);
        }
    });
    const fileFilter = (req,file,cb)=>{
        if(file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png'|| file.mimetype === 'image/jpg'){
            //accept and store file
            cb(null,true);
        }else{
            //reject and do not store file
            cb(null,false);

        }

    };
    const upload = multer({
            storage:storage,
            limits:{
                //5MB limit
                    fileSize:1024*1024*5
            },
            fileFilter:fileFilter
    });


//Product Model
const Product =require('../models/Product');
//Isbn Model
const Isbn=require('../models/Isbn');
//Get By Shop Id
router.get('/',(req,res,next)=>{
    Product.find().exec().then(docs=>{
        console.log(docs);
        res.status(200).json(docs);
    }).catch(err=>{
        console.log(err);
        res.status(200).json({
            error:err
        });
    })
    // Product.find().where
    // Product.find().limit
})

//Get By Shop Name
router.get('/shopName/:shopName',(req,res,next)=>{
    const shopName = req.params.shopName;
    Product.find({ shopName: shopName })
            .then((products)=>{
                res.status(200).json(products);
            }).catch((err)=>{
                console.log(err);
                res.status(200).json({error:err});
            });
    
})

//Get By product Name
router.get('/productName/:name',(req,res,next)=>{
    const productName = req.params.shopName;
    Product.find({ name: productName })
            .then((products)=>{
                res.status(200).json(products);
            }).catch((err)=>{
                console.log(err);
                res.status(200).json({error:err});
            });
    
})

//Get By product CATEGORY
router.get('/category/:category',(req,res,next)=>{
    const category = req.params.category;
    Product.find({ category: category})
            .then((products)=>{
                res.status(200).json(products);
            }).catch((err)=>{
                console.log(err);
                res.status(200).json({error:err});
            });
    
});
//Get By product SHOPNAME AND CATEGORY
router.get('/shopName/category/:shopName/:category',(req,res,next)=>{
    const category = req.params.category;
    const shopName = req.params.shopName;

    Product.find({ category: category,shopName:shopName})
            .then((products)=>{
                res.status(200).json(products);
            }).catch((err)=>{
                console.log(err);
                res.status(200).json({error:err});
            });
    
})
//Get By product ISBN
router.get('/isbn/:isbn',(req,res,next)=>{
    const isbn = req.params.isbn;
            Isbn.find({isbn:isbn}).
                then((isbns)=>{
                    res.status(200).json(isbns); 

                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({error:err});
                });

})
//Get By product PRODUCT ID
router.get('/productId/:productId',(req,res,next)=>{
    const productId = req.params.productId;
            Product.find({_id:productId}).
                then((products)=>{
                    res.status(200).json(products); 

                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({error:err});
                });

})

//Get By product ISBN  and PRODUCT ID
router.get('/productId/isbn/:productId/:isbn',(req,res,next)=>{
    const productId = req.params.productId;
    const isbn = req.params.isbn;


            Isbn.find({isbn:isbn,productId:productId}).
                then((isbns)=>{
                    Product.find({ _id:productId})
                          .then((products)=>{
                            res.status(200).json({
                                product:products,
                                isbn:isbns
                            }); 
                          });

                }).catch((err)=>{
                    console.log(err);
                    res.status(200).json({error:err});
                });



    
})

// Adding an isbn to existing product
router.post('/isbn',(req,res,next)=>{
    const isbn =new Isbn({
        _id:new mongoose.Types.ObjectId(), 
        productId:req.body.productId,
        isbn:req.body.isbn,
        status:'shelved'
    });
       //saving isbn to database
       isbn.save()
       .then((result)=>{
          console.log(result);
       })
       .catch(err=>{
           console.log(err);
       });

   res.status(201).json({
       message:"Handling POST requests to /products isbn",
       createdIsbn:isbn
   })
});


//Adding new product
router.post('/product',upload.single('productImage'),(req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id:new mongoose.Types.ObjectId(),     
        shopId:req.body.shopId,
        shopName:req.body.shopName,
        // isbn:req.body.isbn,
        name:req.body.name,
        category:req.body.category,
        brand:req.body.brand,
        quantity:req.body.quantity,
        price:req.body.price,
        otherQualities:req.body.otherQualities,
        productImage:req.file.path
    });
    //saving product to database
    product.save()
        .then((result)=>{
           console.log(result);
        })
        .catch(err=>{
            console.log(err);
        });

    res.status(201).json({
        message:"Handling POST requests to /products",
        createdProduct:product
    })
});
//update by id
router.patch('/update/:productId',(req,res,next)=>{
    const id= req.params.productId;
    const updateOps ={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }

    //Example:
    // [
    //     {
    //         "propName":"name",
    //         "value":"Youghurt"
    //     }
    // ]
    Product.update({_id:id},{$set:updateOps}).exec().then(
        (result)=>{
            consle.log(result);
            res.status(200).json(result);
        }).catch((err)=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });


});


//delete by id
router.delete('/delete/:productId',(req,res,next)=>{
    const id= req.params.productId;
    Product.remove({_id:id}).exec().then((result)=>{
       res.status(200).json(result);
     })
     .catch(err=>{
         console.log(err);
         res.status(500).json({error:err});
     });
});



module.exports = router;
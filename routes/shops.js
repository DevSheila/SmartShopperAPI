//ROUTES:
// get all users
// get user by email(profile)
//get user by email and password(login)
// post user(register)

// update user by email or by password
// delete user

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



//Shop Model
const Shop =require('../models/Shop');
const Product = require('../models/Product');



//get all shops

router.get('/',async (req,res,next)=>{

  try{
    const shops = await Shop.find();
    res.json(shops);
  }catch(err){
    res.json({mesage:err});
  }

});


//login handle
router.get('/login/:email/:password',async (req,res)=>{
  const email = req.params.email;
  let password = req.params.password;

  try {
    const shop = await Shop.findOne({ email: email });
    console.log(shop);
    if (shop) {
      const cmp = await bcrypt.compare(password, shop.password);
      if (cmp) {
        res.json({
          id:shop.id,
          name:shop.name,
          email:shop.email,
          message:`shop found`
         });
      
      } else {
        res.json({
          message:`shop not found`
         });
      }
    } else {
      res.json({
        message:`shop not found`
       });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

router.get('/:email',(req,res)=>{
  const email = req.params.email;
 
  Shop.find({},function(err,shops){
    if(err){
      return done(err);
    }

    if(shops){
     
      let foundShops=[];
        for( var i =0;i<shops.length;i++){
          if((shops[i].email)== email){
            foundShops.push(shops[i]);
          }
        }

        if(foundShops.length >0){
          for( var j=0; j<foundShops.length;j++){
            res.json({
              id:foundShops[j].id,
              name:foundShops[j].name,
              email:foundShops[j].email,
              message:`shop found`
             });
          }
        }else{
          res.json({
            message:`shop not found`
           });
        }
        
    }
  })
})
// Register
router.post('/register', upload.single('logo'),(req, res) => {
  
  const createdShop = new Shop({
    _id:new mongoose.Types.ObjectId(),     
    name:req.body.name,
    location:req.body.location,
    logo:req.file.path,
    email:req.body.email,
    password:req.body.password
  });
  const password2= req.body.password2;
  let errors = [];

  if (!createdShop.name || !createdShop.email || !createdShop.password || !password2) {
    errors.push({ empty: 'Please enter all fields' });
  }

  if (createdShop.password != password2) {
    errors.push({ passMatch: 'Passwords do not match' });
  }

  if (createdShop.password.length < 6) {
    errors.push({ passLength: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {

    res.json({msg:errors});
  } else {
    Shop.findOne({ email: createdShop.email }).then(shop => {
      if (shop) {
          errors.push({ emailExist: 'Email already exists' });
          res.json({msg:errors});
      } else {

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(createdShop.password, salt, (err, hash) => {
              if (err) throw err;
              createdShop.password = hash;
              createdShop
                .save()
                .then(shop => {
                  console.log(shop);
          
                })
                .catch(err => console.log(err));
            });
          });

          res.status(201).json({
            user:createdShop,
            msg:"Succesful registration"
            
          })

      }
    });
  }
});


  
  // Logout handle
  router.get('/logout', (req, res) => {
    req.logout();
    // req.flash('success_msg', 'You are logged out');
    // res.redirect('/shops/login');
  });
  
  module.exports = router;

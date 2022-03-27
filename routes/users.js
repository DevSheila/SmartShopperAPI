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




//User Model
const User =require('../models/Users');
const Product = require('../models/Product');

//Login page
router.get('/login',(req,res)=>{
    res.render('login');
    // res.send('Login');
});

//Register page
router.get('/register',(req,res)=>{

    res.render('register');
    // res.send('Register');
});

//get all users

router.get('/',async (req,res,next)=>{

  try{
    const users = await User.find();
    res.json(users);
  }catch(err){
    res.json({mesage:err});
  }

});


// Login handle 

router.get('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);


});

router.get('/login/:email/:password',async (req,res)=>{
  const email = req.params.email;
  let password = req.params.password;

  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      const cmp = await bcrypt.compare(password, user.password);
      if (cmp) {
        //   ..... further code to maintain authentication like jwt or sessions
        res.json(user);
        res.send("Auth Successful");
      } else {
        // res.json({
        //   message:`user not found`
        //  });
        res.json();
      }
    } else {
      // res.json({
      //   message:`user not found`
      //  });
       res.json();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server error Occured");
  }
});

router.get('/:email',(req,res)=>{
  const email = req.params.email;
 
  User.find({},function(err,users){
    if(err){
      return done(err);
    }

    if(users){
     
      let foundUsers=[];
        for( var i =0;i<users.length;i++){
          if((users[i].email)== email){
            foundUsers.push(users[i]);
          }
        }

        if(foundUsers.length >0){
          for( var j=0; j<foundUsers.length;j++){
            res.json({
              id:foundUsers[j].id,
              name:foundUsers[j].name,
              email:foundUsers[j].email,
              message:`user found`
             });
          }
        }else{
          res.json({
            message:`user not found`
           });
        }
        
    }
  })
})
// Register
router.post('/register', upload.single('userImage'),(req, res) => {
  
  const createdUser = new User({
    _id:new mongoose.Types.ObjectId(),     
    name:req.body.name,
    userImage:req.file.path,
    email:req.body.email,
    password:req.body.password
  });
  const password2= req.body.password2;
  let errors = [];

  if (!createdUser.name || !createdUser.email || !createdUser.password || !password2) {
    errors.push({ empty: 'Please enter all fields' });
  }

  if (createdUser.password != password2) {
    errors.push({ passMatch: 'Passwords do not match' });
  }

  if (createdUser.password.length < 6) {
    errors.push({ passLength: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {

    res.json({msg:errors});
  } else {
    User.findOne({ email: createdUser.email }).then(user => {
      if (user) {
          errors.push({ emailExist: 'Email already exists' });
          res.json({msg:errors});
      } else {

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(createdUser.password, salt, (err, hash) => {
              if (err) throw err;
              createdUser.password = hash;
              createdUser
                .save()
                .then(user => {
                  console.log(user);
          
                })
                .catch(err => console.log(err));
            });
          });

          res.status(201).json({
            user:createdUser,
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
    // res.redirect('/users/login');
  });
  
  module.exports = router;

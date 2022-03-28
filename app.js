const express = require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport=require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//PassportConfig
require('./config/passport')(passport);
// DB config
const db = require('./config/keys').MongoURI;
//making uplaods file publicly accessible
app.use('/uploads/',express.static('uploads'));
//Body Parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());
//connect to Mongo
mongoose.connect(db,{useNewUrlParser:true})
        .then(()=>console.log('MongoDB Connected..'))
        .catch(err=>console.log(err));

//Express Session
app.use(
        session({
          secret: 'secret',
          resave: true,
          saveUninitialized: true
        })
      );
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables
app.use((req,res,next)=>{
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        next();
});

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');  

//routes
app.use('/shops', require('./routes/shops'));
app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));

app.use('/', require('./routes/index'));




const PORT =process.env.PORT || 5000;
app.listen(PORT,console.log(`Server started on port ${PORT}`));
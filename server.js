require('dotenv').config();
require('./models/db');

require('./controllers/userController');


// Dependecies
var session = require('express-session');
const express = require('express');
var MongoStore = require('connect-mongo')(session);
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
const passport=require('passport');

// External Modeles
const userController = require('./controllers/userController');
const adminController = require('./controllers/adminController');
const frontWeb = require('./controllers/website');
const coursesController = require('./controllers/coursesController');
const blogController = require('./controllers/blogController');
const liveClassesController = require('./controllers/liveClassesController');
const instructorController = require('./controllers/instructorController');

// Variables
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('lyout','main', 'backend','user');
//session
app.use(session(
    {
      secret: 'mysecret',
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
      cookie: { maxAge: 180 * 60 * 1000 }
    }));

 
// passport
app.use(passport.initialize()); // invoke serializeuser method
app.use(passport.session()); // invoke deserializuser method

  
//Globals vars 
// app.use('/',(req,res,next)=>{
//   console.log("Checking " + req.isAuthenticated());
//   res.locals.isAuth=req.isAuthenticated();
//   next();
// })
app.use(function(req,res,next){
    res.locals.session = req.session;
    res.locals.login = req.login;
    if(req.user){
        res.locals.isAuth = true;  
      res.locals.user = req.user;
         
      next();
    }else{
      res.locals.isAuth = false,
      next();
    }
  
  })
  

    // Front end
app.use('/',frontWeb);

// User Route
app.use('/user',userController);

// Admin Route
app.use('/admin',adminController);

// Blogs Route
app.use('/blogs',blogController);

// Courses Route
app.use('/courses',coursesController);

// Live-Classes Route
app.use('/live-classes',liveClassesController);


//Instructor /tutor /teacher Route
app.use('/instructor', instructorController);

app.get('/lec',(req,res)=>{
   res.render('user/lectures');
    
})
app.get('/search/',(req,res)=>{
    let q = req.query.filter;
    // let q = req.query.course.teacher;
    // console.log({filter: req.query.filter, course: req.query.course.qualification, second: req.query.second});
    console.log(q);    
    res.send(q)
    
})


// Listen to Port
app.listen(PORT,()=>{
    console.log(`Server started at port: ${PORT}`);
})

 //Dependecies

const express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const liveclass = require('../models/liveclass');
const passport=require('passport');

//Model
const Instructor=require('../models/instructor');

// Middleware
const smtpEmail = require('../modules/verifyEmail');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));



router.get('/', (req, res, next) => {
liveclass.find({})
.then((list)=>{if (req.isAuthenticated()) {
           
    res.render('instructor/selectcourses',{list:list,layout:'main'});
} else {
    res.redirect('/instructor/login');
}
   

});
    });




router.get('/profile', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('instructor/instructorProfile',{layout:'main'});
    } else {
        res.redirect('/instructor/login');
    }
    
})
router.get('/question-answer', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.render('instructor/queans',{layout:'main'});
    } else {
        res.redirect('/instructor/login');
    }
    
    
})

//Login Register

router
    .route('/login')
    .get((req, res) => {
        res.render('instructor/login',{layout:"main",login:true});
    })
    .post((req, res) => {
        passport.authenticate('local')(req, res, function () {
            // console.log("hello user");
            res.redirect('/instructor/');
        });
    })

router
    .route('/register')
    .get((req, res) => {
        res.render('instructor/register',{layout:"main",login:true});
    })
    .post((req, res) => {
        console.log(req.body);
        [rand, status] = smtpEmail.verifyEmail(req.get('host'), req.body.email);
        console.log(rand, status);
        Instructor.register({ username: req.body.username, email: req.body.email,phno:req.body.phno, registerToken: rand }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('/instructor/register');
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/instructor/verifyEmail');
                });
            }
        })

    })

    router
    .route('/verifyEmail')
    .get((req, res) => {
        res.send('Please Click the Link send to your Mail');
    });

// Exporting router
module.exports = router;
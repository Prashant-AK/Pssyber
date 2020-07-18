//Dependecies
const bcrypt = require("bcrypt");
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
var router = express.Router();
var rand, status;

//Models
const User = require('../models/usersModel');
const UserProfile = require('../models/userProfile');
const UserEnrolledCourses = require('../models/userEnrolledCourses');
const Course = require("../models/courseModel");
// const quiz=require("../models/Add_quiz");
// Modules
const smtpEmail = require('../modules/verifyEmail');

// Express
router.use(express.static('public'));

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(session({
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: false
}));

// Passport Init
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});



// Use Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/user/auth/google/studeebee",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOne({ 'email': profile.emails[0].value }, function (err, user) {
            if (err) {
                return cb(err);
            }
            // No User was found- Create One
            if (!user) {
                user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    password: null,
                    isVerified: true,
                    provider: 'Google',
                    // Now in the future searching of User.findOne({'google.id': profile.id } will match because of this next line
                    google: profile._json
                })
                user.save(function (err) {
                    if (err) console.log(err);
                    return cb(err, user);
                });
            } else {
                // foundUser return
                return cb(err, user);
            }
        });
    }
));

// Use Passport Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/user/auth/facebook/studeebee",
    enableProof: true,
    profileFields: ['id', 'email', 'displayName']
},
    function (accessToken, refreshToken, profile, cb) {
        User.findOne({ 'email': profile.emails[0].value }, function (err, user) {
            if (err) {
                return cb(err);
            }
            // No User was found- Create One
            if (!user) {
                user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    password: null,
                    isVerified: true,
                    provider: 'Facebook',
                    // Now in the future searching of User.findOne({'facebook.id': profile.id } will match because of this next line
                    google: profile._json
                })
                user.save(function (err) {
                    if (err) console.log(err);
                    return cb(err, user);
                });
            } else {
                // foundUser return
                return cb(err, user);
            }
        });
    }
));



//
// Google SignIn Route
// _______________________________________________________ //

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/studeebee',
    passport.authenticate('google', { failureRedirect: '/user/login' }),
    function (req, res) {
        // Successful authentication, redirect dashboard.
        console.log(req.user);
        res.redirect('/user/dashboard');
    });


//
// Facebook SignIn Route
// _______________________________________________________ //
router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get('/auth/facebook/studeebee',
    passport.authenticate('facebook', { failureRedirect: '/user/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/user/dashboard');
    });



// Routes

router
    .route('/dashboard')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            console.log(req.user);
            console.log(req.user.id, req.user.username, req.user.email);
            res.render('user/dashboard',{layout:'main'});
        } else {
            res.redirect('/user/login');
        }
    })

router
    .route('/courses')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            UserEnrolledCourses.findOne({ user_id: req.user }).populate('enrolled')
                .exec()
                .then((item) => {
                    res.render('user/courses', { course: item.enrolled,layout:'main' });
                })
        } else {
            res.redirect('/user/login');
        }
    })

router
    .route('/learn-course/:course_name/:course_id')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            let course_id = req.params.course_id;
            Course.findOne({ _id: course_id }, (err, foundItems) => {
                if (!err && foundItems) {
                    // console.log(foundItems)
                    res.render('user/lectures', { course: foundItems,videoUrl:req.query.video,layout:'main' });
                }
            })
        } else {
            res.redirect('/user/login');
        }
    })


router
    .route('/messages')
    .get((req, res) => {
        res.render('user/messages',{layout:'main'});
    })

router
    .route('/wishlist')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            UserEnrolledCourses.findOne({ user_id: req.user }).populate('wishlist')
                .exec()
                .then((item) => {
                    res.render('user/wishlist', {layout:'main', course: item.wishlist.reverse() });
                })
        } else {
            res.redirect('/user/login');
        }
    })
    .post((req, res) => {
        let course_id = req.query.id;
        let course_name = req.query.name;
        if (req.isAuthenticated()) {
            UserEnrolledCourses.findOne({ user_id: req.user }, (err, foundItems) => {
                if (!err) {
                    if (!foundItems) {
                        const newEnrolled = new UserEnrolledCourses({
                            user_id: req.user,
                            wishlist: [],
                        })
                        newEnrolled.wishlist.push(course_id);
                        newEnrolled.save()
                        res.redirect(`/courses/${course_name}/${course_id}`);
                    } else if (foundItems) {
                        if (!foundItems.wishlist.includes(course_id)) {
                            foundItems.wishlist.push(course_id)
                            foundItems.save();
                        }
                        res.redirect(`/courses/${course_name}/${course_id}`);
                    }
                }
            })
        } else {
            res.redirect('/user/login')
        }
    })

router
    .route('/enrolled')
    .post((req, res) => {
        let course_id = req.query.id;
        let course_name = req.query.name;
        if (req.isAuthenticated()) {
            UserEnrolledCourses.findOne({ user_id: req.user }, (err, foundItems) => {
                if (!err) {
                    if (!foundItems) {
                        const newEnrolled = new UserEnrolledCourses({
                            user_id: req.user,
                            enrolled: []
                        })
                        newEnrolled.enrolled.push(course_id);
                        newEnrolled.save()
                        res.redirect(`/courses/${course_name}/${course_id}`);
                    } else if (foundItems) {
                        if (!foundItems.enrolled.includes(course_id)) {
                            foundItems.enrolled.push(course_id)
                            foundItems.save();
                        }
                        res.redirect(`/courses/${course_name}/${course_id}`);
                    }
                }
            })
        } else {
            res.redirect('/user/login')
        }
    })

router
    .route('/profile')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            UserProfile.findOne({ userId: req.user }, (err, foundItems) => {
                if (!err) {
                    if (!foundItems) {
                        const newUserProfile = new UserProfile({
                            userId: req.user,
                            fullName: ' ',
                            college: ' ',
                            phone: ' ',
                            address: ' ',
                            postcode: ' ',
                            linkedin: ' ',
                            facebook: ' ',
                            twitter: ' ',
                            instagram: ' ',
                        });
                        newUserProfile.save();
                        res.redirect('/user/profile');
                    } else {
                        res.render('user/userProfile', {
                            layout:'main',
                            // Profile Specific Details
                            userId: foundItems.userId,
                            fullName: foundItems.fullName,
                            cllg: foundItems.college,
                            phone: foundItems.phone,
                            address: foundItems.address,
                            postcode: foundItems.postcode,
                            linkedin: foundItems.linkedin,
                            facebook: foundItems.facebook,
                            twitter: foundItems.twitter,
                            instagram: foundItems.instagram,
                        });
                    }
                }
            })
        } else {
            res.redirect('/user/login');
        }
    })
    .post((req, res) => {
        UserProfile.findOneAndUpdate({ userId: req.user },
            {
                $set:
                {
                    fullName: req.body.fullName,
                    college: req.body.cllg,
                    phone: req.body.phone,
                    address: req.body.address,
                    postcode: req.body.postcode,
                    linkedin: req.body.linkedin,
                    facebook: req.body.facebook,
                    twitter: req.body.twitter,
                    instagram: req.body.instagram
                }
            }, (err, d) => {
                if (err) console.log(err);
                else {
                    console.log(d)
                    res.redirect('/user/profile',{layout:'main'});
                };
            });
    })

// Change Password Route
router
    .route('/changePassword/:userId')
    .post((req, res) => {
        let userId = req.params.userId;
        let newPass = req.body.newPass;
        let renewPass = req.body.renewPass;
        if (newPass === renewPass) {

            User.findOneAndUpdate({ _id: userId }, { $set: { password: newPass } }, (err, doc) => {
                if (!err) {
                    console.log(doc);
                    res.redirect('/user/profile');
                } else {
                    console.log(err);
                }
            })
        } else {
            res.redirect('/user/profile');
        }

    })

// Signin-Signout Routes
router
    .route('/logout')
    .get((req, res) => {
        req.logout;
        res.redirect('/user/login');
    })


router
    .route('/login')
    .get((req, res) => {
        res.render('studeebee/login',{layout:"main",login:true});
    })
    .post((req, res) => {
        passport.authenticate('local')(req, res, function () {
            res.redirect('/user/dashboard');
        });
    })

router
    .route('/register')
    .get((req, res) => {
        res.render('studeebee/register',{layout:"main",login:true});
    })
    .post((req, res) => {
        [rand, status] = smtpEmail.verifyEmail(req.get('host'), req.body.email);
        console.log(rand, status);
        User.register({ username: req.body.username, email: req.body.email, registerToken: rand }, req.body.password, function (err, user) {
            if (err) {
                console.log(err);
                res.redirect('/user/register');
            } else {
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/user/verifyEmail');
                });
            }
        })

    })

router
    .route('/verifyEmail')
    .get((req, res) => {
        res.send('Please Click the Link send to your Mail');
    })

router
    .route('/signin/verify')
    .get((req, res) => {
        let user_id = req.query.id;
        if (user_id == rand) {
            console.log(true);
            User.findOneAndUpdate({ registerToken: user_id }, { $set: { isVerified: true } }, (err, doc) => {
                if (err) console.log("Something wrong when updating data!");
                else {
                    res.redirect('/user/dashboard');
                }
            });
        } else {
            res.end('Error');
        }
    })

    // router
    // .route('/quiz-tim')
    // .get((req, res) => {
    //     Quiz.findOne({course_title:"FullStack React BootCamp 2020"})
    //     .then((quiz) => {
    //         if(quiz)
    //         console.log(quiz);
    //         console.log(quiz.questions.length)
    //         console.log(quiz.questions[0].question);
    //         // console.log(course);

    //         res.render('courses/quiz',{layout:'main',quiz:quiz});
    //     }).catch(e=>{
    //         res.send("quiz not found")
    //     })
    // })

// Exporting router
module.exports = router;
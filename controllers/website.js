//Dependecies
const bcrypt = require("bcrypt");
const express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

//Models
const User = require('../models/usersModel');
const Blog = require('../models/blogModel');
const { route } = require("./userController");
const Course = require("../models/courseModel");

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));


// Get Routes
// ____________________________________________

router
    .route('/')
    .get((req, res) => {
        Course.find({}, (err, foundItem) => {
            if (!err && foundItem) {
                Blog.find({}, (err, foundBlog) => {
                    if (!err && foundBlog) {
                        res.render('studeebee/index', {layout:'main',
                            course: foundItem,
                            blog: foundBlog
                        });
                    }
                })
            }
        })
    })

router
    .route('/home')
    .get((req, res) => {
        res.redirect('/');
    })

router
    .route('/about-us')
    .get((req, res) => {
        res.render('studeebee/about',{layout:'main'})
    })

router
    .route('/faq')
    .get((req, res) => {
        res.render('studeebee/faq',{layout:'main'})
    })

router
    .route('/contact-us')
    .get((req, res) => {
        res.render('studeebee/contact',{layout:'main'})
    })

router
    .route('/private-policy')
    .get((req, res) => {
        res.render('studeebee/privacy',{layout:'main'})
    })

router
    .route('/terms-and-conditions')
    .get((req, res) => {
        res.render('studeebee/tnc',{layout:'main'})
    })

router
    .route('/memberships')
    .get((req, res) => {
        res.render('studeebee/membership',{layout:'main'})
    })

module.exports = router;
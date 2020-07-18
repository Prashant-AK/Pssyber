// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
var router = express.Router();

// Express
router.use(express.static('public'));

// Models
const Blog = require('../models/blogModel');

// Modules
const today = require('../modules/dateModule');

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));

//Route
router
    .route('/')
    .get((req, res) => {
        Blog.find({}, function (err, foundItem) {
            if (!err) {
                if (foundItem) {
                    res.render('blogs/blogs_page', {layout:'main', blogItem: foundItem.reverse() });
                }
            }
        })
    })

router
    .route('/:blogTitle/:id')
    .get((req, res) => {
        let id = req.params.id;
        Blog.find({}, function (err, allBlog) {
            if (!err && allBlog) {
                Blog.findOne({ _id: id }, function (err, foundItem) {
                    if (!err) {
                        if (foundItem) {
                            res.render('blogs/blog_details', {layout:'main',
                                item: foundItem,
                                allBlog: allBlog.reverse(),
                            });
                        }
                    }
                })
            }
        })
    })

router
    .route('/subscribe/:blogName/:blogId')
    .post((req, res) => {
        let blogName = req.params.blogName;
        let blogId = req.params.blogId;
        let email = req.body.email;
        res.redirect(`/blogs/${blogName}/${blogId}`)
    })




module.exports = router;

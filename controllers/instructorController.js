 //Dependecies

const express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();
const liveclass = require('../models/liveclass');

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));


// router.get('/', (req, res, next) => {
//     res.render('instructor/dashboard');
// })

// router.get('/dashboard', (req, res, next) => {
//     res.render('instructor/dashboard');
// })



router.get('/', (req, res, next) => {
liveclass.find({})
.then((list)=>{
    res.render('instructor/selectcourses',{list:list});

})
    })

router.get('/profile', (req, res, next) => {
    res.render('instructor/instructorProfile');
})
router.get('/question-answer', (req, res, next) => {
    res.render('instructor/queans');
})

// Exporting router
module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
var router = express.Router();

// Express
router.use(express.static('public'));

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));




// Routes

router
    .route('/')
    .get((req, res) => {
        res.render('liveClasses/live_event',{layout:'main'});
    })

    router
    .route('/live-class')
    .get((req, res) => {
        console.log(req.isAuthenticated());
        if (req.isAuthenticated()) {
            console.log(req.user);
            
            res.render('user/dashboard',{layout:'main'});
        } else {
            res.redirect('/user/login');
        }
    });

module.exports = router;
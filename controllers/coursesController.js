const express = require('express');
const bodyParser = require('body-parser');
const { getVideoDurationInSeconds } = require('get-video-duration')
var router = express.Router();
const checksum_lib = require('../paytm/checksum');
// Express
router.use(express.static('public'));

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));

// Models
const Course = require('../models/courseModel');
const { Promise } = require('mongoose');




router
.route('/paytm')
.get((req,res,next)=>{
// if(req.user){
// var price=req.query.price;
// var address=req.query.address;
// Cart.findOne({userId:req.user.id})
// .then((cart)=>{
//     var arr=[];
//     var orderId = "ORDER"+makeid(5);
//     for(var i=0;i<=cart.items.length-1;i++){
//         arr.push({productId:cart.items[i].productId,qty:cart.items[i].qty,date:Date.now(),orderId:orderId,address:address})
//     }
//     var date = new Date()
//     Orders.findOneAndUpdate({userId:req.user.id},{$push:{items:arr},$set:{updateDate:date}},{new:true, useFindAndModify: false})
//     .then((orders)=>{
//         for(var i=0;i<=cart.items.length-1;i++) {
//             cart.items[i].remove();      
//         }
//         // cart.save()
        // .then(()=>{
            // console.log(price);
            // Settings.findOne({name:'gambo'})
            // .then((setting)=>{
                // console.log(setting);
            var paytmParams = {
                "MID" : "xAYPDl65893484775416",
                "WEBSITE" : "WEBSTAGING",
                "INDUSTRY_TYPE_ID" :"Retail",
                "CHANNEL_ID" : "WEB",
                "ORDER_ID" : 'TEST_'  + new Date().getTime(),
                "CUST_ID" : "1215232",
                "MOBILE_NO" : "8864933491",
                "EMAIL" : "anas@gmail.com",
                "TXN_AMOUNT" : "20",
                "CALLBACK_URL" : "http://localhost:3000/user/dashboard",
            };
            // console.log(paytmParams);
            
            checksum_lib.genchecksum(paytmParams,"D27nwcZk_%Y2R20k", function(err, checksum){
                var url = "https://securegw-stage.paytm.in/order/process";
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write('<html>');
                res.write('<head>');
                res.write('<title>Merchant Checkout Page</title>');
                res.write('</head>');
                res.write('<body>');
                res.write('<center><h1>Please do not refresh this page...</h1></center>');
                res.write('<form method="post" action="' + url + '" name="paytm_form">');
                    for(var x in paytmParams){
                        res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
                    }
                    res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
                    res.write('</form>');
                    res.write('<script type="text/javascript">');
                    res.write('document.paytm_form.submit();');
                    res.write('</script>');
                    res.write('</body>');
                    res.write('</html>');
                    res.end();
                });
                // })
            // })

        // })
//     })
// }
// else{

// }
})  

// Routes

router
    .route('/')
    .get((req, res) => {
        let filter = req.query.filter;
        Course.find({}, function (err, foundItem) {
            if (!err) {
                if (foundItem) {
                    res.render('courses/explore_courses', { courses: foundItem, filter: filter,layout:'main' });
                }
            }
        })
    })

router
    .route('/:courseName/:id')
    .get((req, res) => {
        let courseName = req.params.courseName;
        let id = req.params.id;
        Course.findOne({ _id: id }, function (err, foundItem) {
            if (!err) {
                if (foundItem) {
                    let totalLectures = 0;
                    foundItem.content.forEach((item) => {
                        totalLectures = item.sectionVideoTitle.length + totalLectures;

                    })
                    // let totalVideoDuration = 0;
                    // foundItem.content.forEach((item) => {
                    //     item.sectionVideoUrl.forEach((videoUrl) => {
                    //         getVideoDurationInSeconds(videoUrl).then((duration) => {
                    //             console.log(duration);
                    //             totalVideoDuration = duration + totalVideoDuration;
                    //         })
                    //     })
                    // })
                    
                    res.render('courses/course_details', { course: foundItem, totalLectures: totalLectures,layout:'main'});
                }
            }
        })
    })


module.exports = router;
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

// router.get(('/paytm'),(req,res,next)=>{
// // if(req.user){
// var price=req.query.price;
// var address=req.query.address;
// // Cart.findOne({userId:req.user.id})
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
//         .then(()=>{
//             // console.log(price);
//             Settings.findOne({name:'gambo'})
//             .then((setting)=>{
//                 // console.log(setting);
//             var paytmParams = {
//                 "MID" : setting.merchantId,
//                 "WEBSITE" : setting.website,
//                 "INDUSTRY_TYPE_ID" :setting.industryType,
//                 "CHANNEL_ID" : setting.channelId,
//                 "ORDER_ID" : 'TEST_'  + new Date().getTime(),
//                 "CUST_ID" : req.user.id.toString(),
//                 "MOBILE_NO" : req.user.phone,
//                 "EMAIL" : req.user.emailaddress,
//                 "TXN_AMOUNT" : price,
//                 "CALLBACK_URL" : setting.callbackUrl,
//             };
//             // console.log(paytmParams);
            
//             checksum_lib.genchecksum(paytmParams,setting.merchantKey, function(err, checksum){
//                 var url = setting.transactionUrl;
//                 res.writeHead(200, {'Content-Type': 'text/html'});
//                 res.write('<html>');
//                 res.write('<head>');
//                 res.write('<title>Merchant Checkout Page</title>');
//                 res.write('</head>');
//                 res.write('<body>');
//                 res.write('<center><h1>Please do not refresh this page...</h1></center>');
//                 res.write('<form method="post" action="' + url + '" name="paytm_form">');
//                     for(var x in paytmParams){
//                         res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
//                     }
//                     res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
//                     res.write('</form>');
//                     res.write('<script type="text/javascript">');
//                     res.write('document.paytm_form.submit();');
//                     res.write('</script>');
//                     res.write('</body>');
//                     res.write('</html>');
//                     res.end();
//                 });
//                 })
//             })

//         })
//     })
// // }
// // else{

// // }
// })  
// const checksum_lib = require('./checksum');

// https.createServer(function (req, res) {
// 	/* initialize an object with request parameters */
// 	var paytmParams = {

// 		/* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
// 		"MID" : "YOUR_MID_HERE",

// 		/* Find your WEBSITE in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
// 		"WEBSITE" : "YOUR_WEBSITE_HERE",

// 		/* Find your INDUSTRY_TYPE_ID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
// 		"INDUSTRY_TYPE_ID" : "YOUR_INDUSTRY_TYPE_ID_HERE",

// 		/* WEB for website and WAP for Mobile-websites or App */
// 		"CHANNEL_ID" : "YOUR_CHANNEL_ID",

// 		/* Enter your unique order id */
// 		"ORDER_ID" : "YOUR_ORDER_ID",

// 		/* unique id that belongs to your customer */
// 		"CUST_ID" : "CUSTOMER_ID",

// 		/* customer's mobile number */
// 		"MOBILE_NO" : "CUSTOMER_MOBILE_NUMBER",

// 		/* customer's email */
// 		"EMAIL" : "CUSTOMER_EMAIL",

// 		/**
// 		* Amount in INR that is payble by customer
// 		* this should be numeric with optionally having two decimal points
// 		*/
// 		"TXN_AMOUNT" : "ORDER_TRANSACTION_AMOUNT",

// 		/* on completion of transaction, we will send you the response on this URL */
// 		"CALLBACK_URL" : "YOUR_CALLBACK_URL",
// 	};

	/**
	* Generate checksum for parameters we have
	* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
	*/
// 	checksum_lib.genchecksum(paytmParams, "YOUR_KEY_HERE", function(err, checksum){

// 		/* for Staging */
// 		var url = "https://securegw-stage.paytm.in/order/process";

// 		/* for Production */
// 		// var url = "https://securegw.paytm.in/order/process";

// 		/* Prepare HTML Form and Submit to Paytm */
// 		res.writeHead(200, {'Content-Type': 'text/html'});
// 		res.write('<html>');
// 		res.write('<head>');
// 		res.write('<title>Merchant Checkout Page</title>');
// 		res.write('</head>');
// 		res.write('<body>');
// 		res.write('<center><h1>Please do not refresh this page...</h1></center>');
// 		res.write('<form method="post" action="' + url + '" name="paytm_form">');
// 		for(var x in paytmParams){
// 			res.write('<input type="hidden" name="' + x + '" value="' + paytmParams[x] + '">');
// 		}
// 		res.write('<input type="hidden" name="CHECKSUMHASH" value="' + checksum + '">');
// 		res.write('</form>');
// 		res.write('<script type="text/javascript">');
// 		res.write('document.paytm_form.submit();');
// 		res.write('</script>');
// 		res.write('</body>');
// 		res.write('</html>');
// 		res.end();
// 	});
// })

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
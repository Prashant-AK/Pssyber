// Depedencies
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');




// Set Amazon Uploading Engine
const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});

// Init Upload AWS
const uploads3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'studeebee',
        acl:'public-read',
        key: (req, file, cb) => {
            console.log(file);
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
});



module.exports = uploads3;
const aws = require('aws-sdk');
require('dotenv').config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey
const pupperUrl = 'guarded-escarpment-41457.herokuapp.com';
const S3_BUCKET = process.env.Bucket;
const BC_S3_BUCKET = process.env.bc_Bucket;
// Now lets export this function so we can call it from somewhere else
exports.sign_s3 = (req, res) => {
    const ref = req.get('origin');
    console.log('REFURL:', ref);
    if (ref === pupperUrl) {
        aws.config.update({
            region: 'us-east-2', // Put your aws region here
            accessKeyId: process.env.AWSAccessKeyId,
            secretAccessKey: process.env.AWSSecretKey
        })
    } else {
        aws.config.update({
            region: 'us-east-2', // Put your aws region here
            accessKeyId: process.env.bc_AWSAccessKeyId,
            secretAccessKey: process.env.bc_AWSSecretKey
        })
    }


    console.log("INSIDE SIGN_S3 FUNC \n\n fileName: " + req.body.fileName + "\nfileType: " + req.body.fileType);
    const s3 = new aws.S3();  // Create a new instance of S3gi
    const fileName = req.body.fileName;
    const fileType = req.body.fileType;
// Set up the payload of what we are sending to the S3 api
    let s3Params = {};

    if(req.header.referer === pupperUrl){
        s3Params = {
            Bucket: S3_BUCKET,
            Key: fileName,
            Expires: 50,
            ContentType: fileType,
            ACL: 'public-read'
        }
    }else{
        s3Params = {
            Bucket: BC_S3_BUCKET,
            Key: fileName,
            Expires: 50,
            ContentType: fileType,
            ACL: 'public-read'
    }
    }

// Make a request to the S3 API to get a signed URL which we can use to upload our file
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            res.json({success: false, error: err})
        }
        // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.json({success: true, data: {returnData}});
    });
};
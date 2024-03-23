const { S3Client } = require('@aws-sdk/client-s3');

const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.ACCESS_SECRET_KEY;

// const region = "us-east-2";
// const accessKeyId = "AKIA6H7AXA4OYI57IMWB";
// const secretAccessKey = "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";

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
module.exports = s3Client;

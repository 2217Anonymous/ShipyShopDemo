const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs'); // Node's File System module
const Jimp              = require('jimp'); // Required for image manipulation



const uploadImages =  (files,cb)=>{

    const bucketName = process.env.REACT_APP_S3_NAME
    const s3 = new AWS.S3({
        accessKeyId: process.env.REACT_APP_S3_API_ACCESS_ID,
        secretAccessKey: process.env.REACT_APP_S3_API_ACCESS_KEY,
        region: process.env.REACT_APP_S3_API_ACCESS_REGION
        });

        var data = [];
        let i = 0, length = files.length;
        if(files.length > 0) {
            files.forEach(async (file, index) => {

                let image = await Jimp.read(file.path);
    
                await image.resize(275.98,367.97, Jimp.AUTO).quality(80) ; // Resize to width 500, maintain aspect ratio
                const resizedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
    
                    const params = {
                            Bucket: bucketName,
                            Key: `images/${file.originalname}`,
                            Body: resizedBuffer,
                    };
                            
                    await s3.upload(params, (err, result) => {
                    
                        if (err) {
                            cb("")
                        } else {
                            data.push(result.Location);
                    
                            i++;
                            if(i == length) {
                                cb(data)
                            }
                            // cb(result)
                        }
                    });
    
                });
        }else{
            cb([])
        }
            

}








module.exports = {uploadImages}
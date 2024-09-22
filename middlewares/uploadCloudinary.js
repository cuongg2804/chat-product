




 
 module.exports.uploadSingle = function (req, res, next) {
    if(req.file){
        uploadToCloudinary(req.file.buffer);
    }
    else  {
        next();
    }
}
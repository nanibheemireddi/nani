const fs           = require('fs');
const path         = require('path');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
 
module.exports.uploadImage = function(req, res) {

	

    var files = req.body;

    console.log(files);
    return false;
    


};
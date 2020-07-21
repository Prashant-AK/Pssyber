const Admin = require("../models/adminModel");

module.exports.isAdminAuthorized = function(id){
    let status = false
    Admin.findById(id).exec(function (error, foundUser) {
        if(!error){
            if(foundUser){
                status = true;
            }
        }else{
            console.log(error)
        }
    })
    console.log(status);
    return status;
}
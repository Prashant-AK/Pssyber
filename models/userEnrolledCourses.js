// Dependencies
const mongoose = require('mongoose')


// Variables
const Schema = mongoose.Schema;

enrolledCourses = new Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    wishlist: [{type: mongoose.Schema.Types.ObjectId, ref:"Course"}],
    enrolled: [{type: mongoose.Schema.Types.ObjectId, ref:"Course"}]
});


const UserEnrolledCourses = mongoose.model("UserEnrolledCourses", enrolledCourses);

module.exports = UserEnrolledCourses;



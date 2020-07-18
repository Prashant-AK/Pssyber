// Dependencies
const mongoose = require('mongoose')


// Variables
const Schema = mongoose.Schema;

userProfileSchema = new Schema({
    userId: mongoose.Schema.Types.ObjectId,
    fullName: String,
    phone: String,
    college: String,
    address: String,
    postcode: String,
    linkedin: String,
    facebook: String,
    twitter: String,
    instagram: String
})

const UserProfile = mongoose.model("userProfile", userProfileSchema);

module.exports = UserProfile;
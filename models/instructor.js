// Dependencies
const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

// Variables
const Schema = mongoose.Schema;


// Model
const userSchema = new Schema({
  username:{
    type: String,
    required:true,
    trim:true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phno:{
      type:String
  },
  password: {
    type: String
  },
  role: {
    type: String,
    default: "teacher",
    enum: ["student", "teacher", "admin"],
  },
  isVerified:{
    type:Boolean,
    default: false,
    enum: ["true","false"]
  },
  registerToken:{
    type: String,
    default:null,
  },
  accessToken: {
    type: String,
  },
});


// Plugin
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

const Instructor = mongoose.model("instructor", userSchema);

module.exports = Instructor;

// Dependencies
const mongoose = require('mongoose')


// Variables
const Schema = mongoose.Schema;

liveclass = new Schema({
   title: String,
   category: String,
   level: String,
   language: String,
   date:String,
   time1:String,
    time2:String,
    prereq:String,
    description:String,
    thumbnail:String

})

const Blog = mongoose.model("liveclass", liveclass);

module.exports = Blog;
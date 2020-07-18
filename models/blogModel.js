// Dependencies
const mongoose = require('mongoose')


// Variables
const Schema = mongoose.Schema;

blogSchema = new Schema({
   blogTitle: String,
   blogAuthor: String,
   blogContent: String,
   blogPublishDate: String,
   blogImage:String,
   blogTags: [{type:String}],
})

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
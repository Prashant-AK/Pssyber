// Dependencies
const mongoose = require('mongoose')


// Variables
const Schema = mongoose.Schema;

question = new Schema({
 
    first:String,
    last:String,
    answer:String

})

const ans = mongoose.model("q&a", question);

module.exports = Blog;
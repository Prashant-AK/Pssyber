const mongoose = require("mongoose");
// const { options } = require("../controllers/adminController");
// const { ObjectId } = mongoose.Schema.Types;
var Schema = mongoose.Schema;

var QuizSchema = new Schema({
    courseid: { type: Schema.Types.ObjectId , ref: 'Course' },
    course_title: { type: String  },
    quiz_title: { type: String },
    instructor_name: { type: String },
    description: { type: String },
    questions: { type: Array },
});



const AddQuiz = mongoose.model("add_quiz", QuizSchema);

module.exports = AddQuiz;
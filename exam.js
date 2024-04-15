// models/exam.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: String,
    answerOptions: [String],
    correctAnswer: String
});

const examSchema = new mongoose.Schema({
    name: String,
    status: String, // e.g., 'active', 'inactive'
    time: Number, // in minutes
    questions: [questionSchema]
});

module.exports = mongoose.model('Exam', examSchema);

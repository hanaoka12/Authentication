// dbOperations.js
const mongoose = require('mongoose');
const Exam = require('./exam'); // Adjust the path as necessary

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const exampleExam = new Exam({
    name: "Mathematics Quiz",
    status: "active",
    time: 30, // 30 minutes
    questions: [
        {
            text: "What is 2 + 2?",
            answerOptions: ["2", "3", "4", "5"],
            correctAnswer: "4"
        },
        {
            text: "What is 3 * 3?",
            answerOptions: ["6", "9", "12", "15"],
            correctAnswer: "9"
        }
    ]
});

exampleExam.save()
    .then(() => console.log('Example exam saved successfully'))
    .catch(err => console.error('Error saving example exam:', err));

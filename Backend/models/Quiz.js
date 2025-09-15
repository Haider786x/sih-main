const mongoose = require('mongoose');
const quizSchema = new mongoose.Schema({
  title: String,
  questions: [{
    question: String,
    options: [String],
    answer: Number
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attempts: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    totalQuestions: Number,
    answers: [Number],
    attemptedAt: { type: Date, default: Date.now }
  }]
});
module.exports = mongoose.model('Quiz', quizSchema);

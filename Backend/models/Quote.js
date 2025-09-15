const mongoose = require('mongoose');
const quoteSchema = new mongoose.Schema({
  text: String,
  author: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Quote', quoteSchema);

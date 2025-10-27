const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true },  // URL to photo
  party: { type: String, required: true },
  description: { type: String, required: true },
  votes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
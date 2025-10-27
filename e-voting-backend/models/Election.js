const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'active', 'completed', 'cancelled'], 
    default: 'upcoming' 
  },
  isActive: { type: Boolean, default: false },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  totalVotes: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  settings: {
    allowMultipleVotes: { type: Boolean, default: false },
    requireVerification: { type: Boolean, default: true },
    showResultsBeforeEnd: { type: Boolean, default: false },
    maxCandidates: { type: Number, default: 10 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Election', electionSchema);

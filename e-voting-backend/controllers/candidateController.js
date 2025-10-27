const Candidate = require('../models/Candidate');
const User = require('../models/User');

exports.getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.vote = async (req, res) => {
  const { candidateId } = req.body;
  const userId = req.user.id;  // From auth middleware
  try {
    const user = await User.findById(userId);
    if (user.hasVoted) return res.status(400).json({ message: 'You have already voted' });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    candidate.votes += 1;
    user.hasVoted = true;
    await candidate.save();
    await user.save();
    res.json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
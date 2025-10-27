const Candidate = require('../models/Candidate');

exports.addCandidate = async (req, res) => {
  const { name, photo, party, description } = req.body;
  try {
    const candidate = new Candidate({ name, photo, party, description });
    await candidate.save();
    res.json({ message: 'Candidate added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.viewResults = async (req, res) => {
  try {
    const results = await Candidate.find().select('name votes');
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
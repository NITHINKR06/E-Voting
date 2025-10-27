const Candidate = require('../models/Candidate');
const User = require('../models/User');

exports.addCandidate = async (req, res) => {
  const { name, photo, party, description } = req.body;
  try {
    const candidate = new Candidate({ name, photo, party, description });
    await candidate.save();
    res.json({ message: 'Candidate added successfully', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCandidate = async (req, res) => {
  const { id } = req.params;
  const { name, photo, party, description } = req.body;
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      id, 
      { name, photo, party, description }, 
      { new: true }
    );
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate updated successfully', candidate });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.viewResults = async (req, res) => {
  try {
    const results = await Candidate.find().select('name votes party').sort({ votes: -1 });
    const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0);
    res.json({ results, totalVotes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const votedUsers = await User.countDocuments({ hasVoted: true });
    const totalCandidates = await Candidate.countDocuments();
    const totalVotes = await Candidate.aggregate([
      { $group: { _id: null, total: { $sum: '$votes' } } }
    ]);
    
    const recentUsers = await User.find()
      .select('name email rollNumber createdAt hasVoted')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        verifiedUsers,
        votedUsers,
        totalCandidates,
        totalVotes: totalVotes[0]?.total || 0,
        votingPercentage: totalUsers > 0 ? ((votedUsers / totalUsers) * 100).toFixed(1) : 0
      },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email rollNumber isVerified hasVoted createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isVerified, isAdmin } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id, 
      { isVerified, isAdmin }, 
      { new: true }
    ).select('name email rollNumber isVerified isAdmin hasVoted');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetVoting = async (req, res) => {
  try {
    // Reset all user voting status
    await User.updateMany({}, { hasVoted: false });
    
    // Reset all candidate votes
    await Candidate.updateMany({}, { votes: 0 });
    
    res.json({ message: 'Voting has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
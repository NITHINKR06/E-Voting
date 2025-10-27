const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const User = require('../models/User');

exports.createElection = async (req, res) => {
  const { title, description, startDate, endDate, settings } = req.body;
  const createdBy = req.user.id;

  try {
    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    if (new Date(startDate) <= new Date()) {
      return res.status(400).json({ message: 'Start date must be in the future' });
    }

    const election = new Election({
      title,
      description,
      startDate,
      endDate,
      createdBy,
      settings: settings || {}
    });

    await election.save();
    res.json({ message: 'Election created successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('createdBy', 'name email')
      .populate('candidates', 'name party votes')
      .sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getElectionById = async (req, res) => {
  const { id } = req.params;
  try {
    const election = await Election.findById(id)
      .populate('createdBy', 'name email')
      .populate('candidates', 'name party votes description photo');
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateElection = async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, status, settings } = req.body;

  try {
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Prevent updating if election is active and has votes
    if (election.status === 'active' && election.totalVotes > 0) {
      return res.status(400).json({ message: 'Cannot update active election with votes' });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (startDate) updateData.startDate = startDate;
    if (endDate) updateData.endDate = endDate;
    if (status) updateData.status = status;
    if (settings) updateData.settings = { ...election.settings, ...settings };

    const updatedElection = await Election.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: 'Election updated successfully', election: updatedElection });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteElection = async (req, res) => {
  const { id } = req.params;
  try {
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Prevent deletion if election has votes
    if (election.totalVotes > 0) {
      return res.status(400).json({ message: 'Cannot delete election with votes' });
    }

    await Election.findByIdAndDelete(id);
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.startElection = async (req, res) => {
  const { id } = req.params;
  try {
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status !== 'upcoming') {
      return res.status(400).json({ message: 'Election is not in upcoming status' });
    }

    if (election.candidates.length === 0) {
      return res.status(400).json({ message: 'Cannot start election without candidates' });
    }

    election.status = 'active';
    election.isActive = true;
    await election.save();

    res.json({ message: 'Election started successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.endElection = async (req, res) => {
  const { id } = req.params;
  try {
    const election = await Election.findById(id);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status !== 'active') {
      return res.status(400).json({ message: 'Election is not active' });
    }

    election.status = 'completed';
    election.isActive = false;
    await election.save();

    res.json({ message: 'Election ended successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCandidateToElection = async (req, res) => {
  const { electionId, candidateId } = req.body;
  try {
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status !== 'upcoming') {
      return res.status(400).json({ message: 'Can only add candidates to upcoming elections' });
    }

    if (election.candidates.includes(candidateId)) {
      return res.status(400).json({ message: 'Candidate already added to election' });
    }

    if (election.candidates.length >= election.settings.maxCandidates) {
      return res.status(400).json({ message: 'Maximum candidates limit reached' });
    }

    election.candidates.push(candidateId);
    await election.save();

    res.json({ message: 'Candidate added to election successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeCandidateFromElection = async (req, res) => {
  const { electionId, candidateId } = req.body;
  try {
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    if (election.status !== 'upcoming') {
      return res.status(400).json({ message: 'Can only remove candidates from upcoming elections' });
    }

    election.candidates = election.candidates.filter(id => id.toString() !== candidateId);
    await election.save();

    res.json({ message: 'Candidate removed from election successfully', election });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveElection = async (req, res) => {
  try {
    const activeElection = await Election.findOne({ status: 'active' })
      .populate('candidates', 'name party votes description photo');
    
    if (!activeElection) {
      return res.json({ message: 'No active election', election: null });
    }

    res.json({ election: activeElection });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getElectionStats = async (req, res) => {
  const { id } = req.params;
  try {
    const election = await Election.findById(id)
      .populate('candidates', 'name votes');
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    const totalUsers = await User.countDocuments();
    const votedUsers = await User.countDocuments({ hasVoted: true });

    const stats = {
      election: {
        title: election.title,
        status: election.status,
        totalVotes,
        totalCandidates: election.candidates.length,
        votingPercentage: totalUsers > 0 ? ((votedUsers / totalUsers) * 100).toFixed(1) : 0
      },
      candidates: election.candidates.map(candidate => ({
        name: candidate.name,
        votes: candidate.votes,
        percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0
      }))
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

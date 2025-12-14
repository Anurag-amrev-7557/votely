const Nomination = require('../models/Nomination');
const Poll = require('../models/Poll');
const User = require('../models/User');

// Create a nomination application
exports.createNomination = async (req, res) => {
    try {
        const { pollId, sop, documents } = req.body;
        const userId = req.user._id;

        // Check if poll exists and is active (or upcoming)
        const poll = await Poll.findById(pollId);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Check if user has already applied
        const existingNomination = await Nomination.findOne({ user: userId, poll: pollId });
        if (existingNomination) {
            return res.status(400).json({ message: 'You have already applied for this nomination' });
        }

        const nomination = await Nomination.create({
            user: userId,
            poll: pollId,
            sop,
            documents: documents || [],
            status: 'pending'
        });

        res.status(201).json({ success: true, nomination });
    } catch (error) {
        res.status(500).json({ message: 'Error applying for nomination', error: error.message });
    }
};

// Get nominations for a specific poll (Admin/Committee view)
exports.getPollNominations = async (req, res) => {
    try {
        const { pollId } = req.params;
        const nominations = await Nomination.find({ poll: pollId })
            .populate('user', 'name email batch department profilePhoto')
            .sort({ submittedAt: -1 });

        res.status(200).json({ success: true, nominations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching nominations', error: error.message });
    }
};

// Get my nominations (User view)
exports.getMyNominations = async (req, res) => {
    try {
        const nominations = await Nomination.find({ user: req.user._id })
            .populate('poll', 'title status startDate')
            .sort({ submittedAt: -1 });

        res.status(200).json({ success: true, nominations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching your nominations', error: error.message });
    }
};

// Update nomination status (Approve/Reject)
exports.updateNominationStatus = async (req, res) => {
    try {
        const { nominationId } = req.params;
        const { status, adminComments } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const nomination = await Nomination.findById(nominationId).populate('user').populate('poll');
        if (!nomination) {
            return res.status(404).json({ message: 'Nomination not found' });
        }

        nomination.status = status;
        nomination.adminComments = adminComments || nomination.adminComments;
        nomination.reviewedBy = req.user._id;
        nomination.reviewedAt = Date.now();
        await nomination.save();

        // If approved, automatically add as an option to the poll
        if (status === 'approved') {
            const poll = await Poll.findById(nomination.poll._id);
            // Check if option already exists to avoid duplicates
            const candidateName = nomination.user.name;
            const optionExists = poll.options.find(opt => opt.text === candidateName);

            if (!optionExists) {
                poll.options.push({
                    text: candidateName,
                    description: nomination.sop, // Use SOP as description
                    image: nomination.user.profilePhoto
                });
                await poll.save();
            }
        }

        res.status(200).json({ success: true, nomination });
    } catch (error) {
        res.status(500).json({ message: 'Error updating nomination status', error: error.message });
    }
};

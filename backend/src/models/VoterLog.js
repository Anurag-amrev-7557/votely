const mongoose = require('mongoose');

const voterLogSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    votedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure a user can only vote once per poll
voterLogSchema.index({ poll: 1, user: 1 }, { unique: true });

const VoterLog = mongoose.model('VoterLog', voterLogSchema);
module.exports = VoterLog;

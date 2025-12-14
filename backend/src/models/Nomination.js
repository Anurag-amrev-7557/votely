const mongoose = require('mongoose');

const nominationSchema = new mongoose.Schema({
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    manifesto: {
        type: String, // Markdown text
        required: true,
        maxlength: 5000
    },
    sopUrl: {
        type: String, // URL to PDF/Video on S3
        required: false
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Prevent duplicate nominations for same position in same poll
nominationSchema.index({ poll: 1, candidate: 1, position: 1 }, { unique: true });

const Nomination = mongoose.model('Nomination', nominationSchema);

module.exports = Nomination;

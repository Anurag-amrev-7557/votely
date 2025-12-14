const mongoose = require('mongoose');

const nominationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    poll: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll',
        required: true
    },
    sop: {
        type: String,
        required: [true, 'Statement of Purpose is required'],
        maxlength: [2000, 'SOP cannot exceed 2000 characters']
    },
    documents: [{
        title: String,
        url: String
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminComments: {
        type: String,
        default: ''
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date
}, {
    timestamps: true
});

// Ensure one nomination per user per poll
nominationSchema.index({ user: 1, poll: 1 }, { unique: true });

const Nomination = mongoose.model('Nomination', nominationSchema);
module.exports = Nomination;

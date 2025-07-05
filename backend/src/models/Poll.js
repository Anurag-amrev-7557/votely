const mongoose = require('mongoose');
const sendEmail = require('../utils/email/sendEmail');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  description: { type: String },
  party: { type: String },
  image: { type: String },
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  resultDate: { type: Date },
  status: { type: String, enum: ['active', 'upcoming', 'completed'], default: 'upcoming' },
  options: [optionSchema],
  settings: {
    allowMultipleVotes: { type: Boolean, default: false },
    showResultsBeforeEnd: { type: Boolean, default: false },
    showResultsAfterVote: { type: Boolean, default: false },
    requireAuthentication: { type: Boolean, default: false },
    enableComments: { type: Boolean, default: false },
    showVoterNames: { type: Boolean, default: false },
    notifyOnVote: { type: Boolean, default: false },
    notifyOnEnd: { type: Boolean, default: false },
    maxVotesPerVoter: { type: Number },
    randomizeCandidateOrder: { type: Boolean, default: false },
    voterNameDisplay: { type: String, enum: ['public', 'anonymized'], default: 'public' },
  },
  totalVotes: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Pre-save hook to set status based on dates
pollSchema.pre('save', async function(next) {
  const now = new Date();
  const wasCompleted = this.isModified('status') && this.status === 'completed';
  if (this.endDate && now > this.endDate) {
    this.status = 'completed';
  } else if (this.startDate && now >= this.startDate) {
    this.status = 'active';
  } else {
    this.status = 'upcoming';
  }
  // Send notification if poll just completed
  if (wasCompleted) {
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@example.com',
        subject: `Poll Ended: ${this.title}`,
        text: `The poll "${this.title}" has ended.`,
        html: `<p>The poll <strong>${this.title}</strong> has ended.</p>`
      });
    } catch (e) {
      console.error('Failed to send poll end notification email:', e);
    }
  }
  next();
});

// Static method to update all poll statuses
pollSchema.statics.updateStatuses = async function() {
  const now = new Date();
  await this.updateMany({ endDate: { $lt: now } }, { status: 'completed' });
  await this.updateMany({ startDate: { $lte: now }, endDate: { $gte: now } }, { status: 'active' });
  await this.updateMany({ startDate: { $gt: now } }, { status: 'upcoming' });
};

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll; 
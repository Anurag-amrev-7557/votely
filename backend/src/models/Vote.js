const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for anonymous votes
  options: [{ type: String, required: true }], // Array of option texts or ids
  votedAt: { type: Date, default: Date.now },
  isAnonymous: { type: Boolean, default: false }, // Whether this vote is anonymous
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote; 
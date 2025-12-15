const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for anonymous votes
  options: [{ type: String, required: true }], // Array of option texts or ids
  votedAt: {
    type: Date,
    default: Date.now
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }, // Whether this vote is anonymous
  // Integrity Fields
  previousBlockHash: {
    type: String,
    default: '0' // Acts as Previous_Row_Hash in the chain
  },
  hash: {
    type: String, // SHA-256(Vote_Data + Previous_Row_Hash)
    required: true
  },
  signature: {
    type: String // Optional: Digital signature if we had client-side keys
  }
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;
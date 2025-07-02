const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  option: { type: String, required: true }, // Option text or id
  votedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote; 
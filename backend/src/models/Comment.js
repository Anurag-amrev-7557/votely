const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // for threaded replies
  approved: { type: Boolean, default: true },
  flagged: { type: Boolean, default: false },
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment; 
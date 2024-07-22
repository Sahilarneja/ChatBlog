const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: { text: { type: String, required: true } },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  sender: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

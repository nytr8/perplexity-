import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
    content: { type: String, required: true },
    role: { type: String, enum: ['user', 'ai'], default: 'user' },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;

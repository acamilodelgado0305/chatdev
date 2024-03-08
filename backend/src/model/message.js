import mongoose from 'mongoose';
//creación del modelo de datos del mensaje
const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
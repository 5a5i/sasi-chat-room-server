// const { createServer } = require('http');
// const { Server } = require('socket.io');
const Message = require('../models/Message');

// const httpServer = createServer();

// const io = new Server(httpServer, {
//   cors: {
//     origin: ["http://localhost:4200"]
// }
// })

// Create a new message
const createMessage = async (req, res) => {
  const { roomId, content } = req.body;
  const userId = req.user.id;
  const userName = req.user.username;

  try {
    const newMessage = new Message({
      roomId,
      content,
      userId,
    });

    await newMessage.save();
    await newMessage.populate('userId');

    // console.log(newMessage);
    res.status(201).json({ message: 'Message created successfully', data: newMessage });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages by roomId
const getMessagesByRoomId = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await Message.find({ roomId }).populate('userId');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createMessage,
  getMessagesByRoomId,
};

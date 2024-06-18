const Room = require('../models/Room');

// Create a new room
const createRoom = async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if the room already exists
    const existingRoom = await Room.findOne({ name });

    if (existingRoom) {
      return res.status(400).json({ message: 'Room already exists' });
    }

    // Create a new room
    const newRoom = new Room({
      name,
      description,
    });

    // Save the room to the database
    await newRoom.save();

    res.status(201).json({ message: 'Room created successfully', data: newRoom });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
};

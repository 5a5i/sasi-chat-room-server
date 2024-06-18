require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const app = express();
const port = 3000;


// const http = require('http').createServer(app);
// const io = require('socket.io')(http, {
//     cors: {
//       origin: 'http://localhost:4200'
//     }
// });

// const httpServer = createServer();

// const io = new Server(httpServer, {
//   cors: {
//     origin: ["http://localhost:4200"]
// }
// })



// const mongoURI = 'mongodb+srv://sasi:SasiMongoDB@sasi-chat-room.cdifmse.mongodb.net/?retryWrites=true&w=majority&appName=sasi-chat-room';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Set up routes and start server
    app.listen(port, () => {
      console.log(`Server is listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas', error);
  }
}

// connectToMongoDB();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Example: Increase server selection timeout
  socketTimeoutMS: 45000, // Example: Increase socket timeout
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());

app.use(bodyParser.json());

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/auth', authRoutes);
app.use('/api', roomRoutes);
app.use('/api', messageRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// io.on('connection', (socket) => {
//   console.log(`User ${socket.id} connected`)
//   let message = io.handshake.query.message;
//   console.log('handshake')
//   console.log(message)

//   // socket.on('message', message => {
//   //   const b = Buffer.from(message)
//   //   console.log(b.toString())
//   //   socket.send(`${message}`)
//   // })
//   socket.on('message', data => {
//     console.log('broadcast')
//     console.log(data)
//     socket.broadcast.emit('message', {socketid: socket.id.substring(0,5), message: data})
//   })
// })

// httpServer.listen(3000, () => console.log('listening on port 3000'))
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: '*',
  }
  });

const users = {};

io.on("connection", (socket) => {
  // console.log(`User ${socket.id} connected`)
  socket.on('user_connected', (userId) => {
    // console.log(socket.id);
    // console.log(userId);
    users[userId] = socket.id;
    // console.log(users);
    // console.log(`User Connected: ${userId}`)
    socket.emit('user_status', users);
    // socket.broadcast.emit('user_status', Object.assign({}, users));
  })
  socket.on('disconnect', data => {
    // console.log('User Disconnected')
    // console.log(socket.id);
    // let socketid = socket.id;
    // let i = users.indexOf(socketid);
    // console.log(i);
    // users.splice(i, 1, 0);

    for(var u in users) {
      if(users[u] == socket.id) {
          delete users[u];
      }
    }
    // console.log(users);
    socket.emit('user_status', users);
    // socket.broadcast.emit('user_status', Object.assign({}, users));
  })
  socket.on('message', data => {
    // console.log('broadcast')
    // console.log(data)
    socket.broadcast.emit('message-broadcast', data);
  })
});

httpServer.listen(3001);

module.exports = app;

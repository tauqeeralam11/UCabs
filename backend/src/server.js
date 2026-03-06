require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});
io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);
  socket.on('joinRideRoom', (rideId) => {
    socket.join(rideId);
    console.log(`📍 Client ${socket.id} joined ride room: ${rideId}`);
  });
  socket.on('driverLocationUpdate', (data) => {
    const { rideId, location } = data;
    io.to(rideId).emit('receiveDriverLocation', location);
  });
  socket.on('disconnect', () => {
    console.log(`🛑 Client disconnected: ${socket.id}`);
  });
});
connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server & WebSockets running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}).catch((err) => {
  console.error("Database connection failed:", err);
});
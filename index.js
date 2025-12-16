const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// SETUP SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all connections (Vercel, Localhost, etc.)
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // 1. Join a specific room
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // 2. Handle Drawing (Broadcast only to that room)
    socket.on('draw', (data) => {
        socket.to(data.room).emit('draw', data);
    });

    // 3. Handle Text (Broadcast only to that room)
    socket.on('text', (data) => {
        socket.to(data.room).emit('text', data);
    });

    // 4. Handle Clear (Broadcast only to that room)
    socket.on('clear', (room) => {
        socket.to(room).emit('clear');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
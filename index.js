const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://sourav-whiteboard.vercel.app", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // 1. Join Room Event
    socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });

    // 2. Drawing Event (Scoped to Room)
    socket.on('draw', (data) => {
        // data now includes { room: '...', x0: ... }
        socket.to(data.room).emit('draw', data);
    });

    // 3. Text Event (Scoped to Room)
    socket.on('text', (data) => {
        socket.to(data.room).emit('text', data);
    });

    // 4. Clear Event (Scoped to Room)
    socket.on('clear', (room) => {
        socket.to(room).emit('clear');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from any origin (required for Vercel/Render split)

const server = http.createServer(app);

// Configure Socket.io with CORS
const io = new Server(server, {
    cors: {
        origin: "*", // well that didnt work so back again
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    // Listen for drawing events
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    // Listen for clear board events
    socket.on('clear', () => {
        io.emit('clear'); // Tell EVERYONE to clear their screen
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
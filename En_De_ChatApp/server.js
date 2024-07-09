// server.js

const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

// Initialize Socket.IO
const io = require("socket.io")(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define Socket.IO event handlers
io.on("connection", function(socket) {
    // Event handler for a new user joining the chat
    socket.on("newuser", function(username) {
        // Broadcast to all clients that a new user has joined
        socket.broadcast.emit("update", username + " joined the conversation");
    });

    // Event handler for a user exiting the chat
    socket.on("exituser", function(username) {
        // Broadcast to all clients that a user has left
        socket.broadcast.emit("update", username + " left the conversation");
    });

    // Event handler for a chat message
    socket.on("chat", function(message) {
        // Broadcast the chat message to all clients
        socket.broadcast.emit("chat", message);
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

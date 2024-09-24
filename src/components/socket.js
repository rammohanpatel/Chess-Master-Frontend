// socket.js
import { io } from 'socket.io-client';

// Use your deployed backend URL here
const socket = io("https://chess-master-backend.onrender.com/", {
  reconnectionAttempts: 5, // Optional: Limit reconnection attempts
  transports: ['websocket'], // Force WebSocket protocol
});

export default socket;

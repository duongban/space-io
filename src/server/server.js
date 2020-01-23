const express = require('express');
const webpack = require('webpack');
const socketio = require('socket.io');

// Setup an Express server
const app = express();
app.use(express.static('public'));

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);
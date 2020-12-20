//index.js
const { wsServer } = require('../wsServer');
const { server } = require('../httpServer');

const scheduleCronstyle = require('../models/schedule');
scheduleCronstyle()



server.on('listening', () => {
  console.log('http server listening');
});
wsServer.on('listening', () => {
  console.log('websocket listening');
});
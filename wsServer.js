const WebSocket = require('ws');
const { server } = require('./httpServer');
const wsServer = new WebSocket.Server({ server });


wsServer.on('connection', (ws) => {
  ws.on('message', async (msg) => {
    try {
      const data = JSON.parse(msg);
      console.log(data)
    } catch (err) {
      console.log(err);
    }
  });
});


exports.wsServer = wsServer;

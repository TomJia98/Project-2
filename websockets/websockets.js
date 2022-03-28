// WEB SOCKET STUFF
// creation of ws server
const http = require('http');
const WebSocket = require('ws');
const app = require('./../express-app');

const server = http.createServer(app);

// web socket
const wss = new WebSocket.Server({ server });

// send to all clients function
wss.broadcast = function broadcast(message) {
  console.log(message);
  wss.clients.forEach(function each(client) {
    client.send(message);
  });
};

wss.on('connection', (ws) => {
  console.log('Server has recieved a new connection');
  //connection is up, let's add a simple simple event
  ws.on('message', (data) => {
    console.log(`client has sent us: ${data}`);
    wss.broadcast(String(data));
  });
  ws.on('close', () => {
    console.log('Client has disconnected');
  });

  //send immediatly a feedback to the incoming connection
  //   ws.send('Hi there, I am a WebSocket server');
});

module.exports = { wss, server };

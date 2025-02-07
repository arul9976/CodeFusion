// const express = require('express');
// const bodyParser = require('body-parser');
// const { exec } = require('child_process');
// const cors = require('cors')

// const app = express();
// const port = 3000;
// app.use(cors());
// app.options('*', cors());
// var allowCrossDomain = function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// }

// app.use(bodyParser.text());
// app.use(allowCrossDomain);

// app.post('/run-code', (req, res) => {
//   const code = req.body;
//   const language = req.query.language;

//   let command;

//   if (language === 'python') {
//     const escapedCode = code.replace(/"/g, '\\"');
//     command = escapedCode;
//   } else if (language === 'node') {
//     command = `node -e "${code}"`;
//   }

//   const { exec } = require('child_process');
//   console.log(code.toLowerCase());
//   console.log();

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       return res.send(`Error: ${error.message}`);
//     }
//     if (stderr) {
//       return res.send(`stderr: ${stderr}`);
//     }
//     res.send(stdout);
//   });

// });



// app.listen(port, () => {
//   console.log(`Web IDE server running on http://localhost:${port}`);
// });


// server.js (Node.js server)
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');  // Import CORS middleware

const app = express();
const server = http.createServer(app);

// CORS options for HTTP requests
const corsOptions = {
  origin: '*',  // Adjust this to your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));  // Enable CORS for Express routes

// Initialize Socket.IO with CORS configuration for WebSocket connections
const io = socketIo(server, {
  cors: {
    origin: '*',  // Allow your frontend origin
    methods: ['GET', 'POST'],
  },
});

app.use(express.static('public')); // Serve static files (your React app)

io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for code updates from a client
  socket.on('code-update', (newCode) => {
    // Broadcast the code to all other connected clients

    console.log("--> " + newCode);

    socket.broadcast.emit('code-update', newCode);
  });

  // Listen for cursor position updates from a client
  socket.on('cursor-position', (position) => {
    socket.broadcast.emit('cursor-position', position);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

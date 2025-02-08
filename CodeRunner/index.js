const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');


const app = express();
const server = http.createServer(app);

// const corsOptions = {
//   origin: '*',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type'],
// };

// app.use(cors(corsOptions));

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// app.use(express.static('public'));
// app.use(bodyParser.text());

// // app.use(cors());
// // app.options('*', cors());
// var allowCrossDomain = function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// }

// app.use(allowCrossDomain);

// app.post('/run-code', (req, res) => {

// });







// io.on('connection', (socket) => {
//   console.log('User Connected');

//   socket.on('code-update', (newCode) => {


//     console.log("--> " + newCode);

//     socket.broadcast.emit('code-update', newCode);
//   });

//   socket.on('cursor-position', (position) => {
//     socket.broadcast.emit('cursor-position', position);
//   });

//   socket.on('output', (data) => {
//     console.log(`Command received: ${data}`);
//     const escapedCode = data.replace(/"/g, '\\"');

//     // Execute the terminal command (e.g., shell command) on the server
//     exec(`python3 -c "${escapedCode}"`, (error, stdout, stderr) => {
//       if (error) {
//         console.log("message ---> " + error.message);
//         socket.emit('output', `Error: ${error.message}\n`);
//         return;
//       }
//       if (stderr) {
//         console.log("stderr ---> " + stderr);

//         socket.emit('output', `stderr: ${stderr}\n`);
//         return;
//       }
//       console.log("Output ---> " + stdout);

//       socket.emit('output', stdout);
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });



// Python code to execute
io.on('connection', (socket) => {
  console.log('Client connected');

  // Start the Python process with xterm
  pythonProcess = spawn('python3', ['-c', `
import sys
while True:
    user_input = input("Enter something: ")
    if user_input.lower() == "exit":
        print("Exiting...")
        sys.exit()
    print(f"Received: {user_input}")
  `]);

  // Read Python's output (stdout) and send to client
  pythonProcess.stdout.on('data', (data) => {
    socket.emit('output', data.toString());
  });

  // Handle Python's stderr
  pythonProcess.stderr.on('data', (data) => {
    socket.emit('output', `Error: ${data.toString()}`);
  });

  // Handle input from React frontend and send to Python
  socket.on('input', (input) => {
    pythonProcess.stdin.write(input + '\n');
  });

  // Handle Python process exit
  socket.on('disconnect', () => {
    pythonProcess.kill();
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

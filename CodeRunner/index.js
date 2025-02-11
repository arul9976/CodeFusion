const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const fs = require('fs');

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

app.use(express.static('public'));
app.use(bodyParser.text());

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







io.on('connection', (socket) => {
  console.log('User Connected');

  // socket.emit('code-update', { code, cursor: { line: 0, ch: 0 } });

  socket.on('code-update', (newCode) => {
    const { code, cursor ,userId} = newCode;
    if(cursor!=undefined){
    console.log("Cursor Row --> " + cursor.row + "\nCursor Column --> " + cursor.column+userId);
    console.log(cursor);

    }
    socket.broadcast.emit('code-update', { code: code, cursor: cursor });
  });
  socket.on("cursor-update", (data) => {
    socket.broadcast.emit("cursor-update", data);
  });

  socket.on("new-user", ({ userId, username }) => {
    users[userId] = username;
    console.log(`User ${userId} set name: ${username}`);
  });

  // socket.on('cursor-position', (position) => {
  //   socket.broadcast.emit('cursor-position', position);
  // });

  socket.on('output', (data) => {
    const { language, code } = data;
    console.log("Code : " + code + "\nLanguage : " + language);

    let command = '';
    let args = [];
    let process;
    let tempFileName;

    switch (language) {
      case 'python':
        command = 'python3';
        args = ['-c', code];
        process = spawn(command, args);
        break;
      case 'javascript':
        command = 'node';
        args = ['-e', code];
        process = spawn(command, args);
        break;
      case 'java':
        tempFileName = 'TempCode';
        let fileNameWithPath = `./${tempFileName}.java`;
        fs.writeFileSync(fileNameWithPath, code);
        command = 'javac';
        args = [fileNameWithPath];
        process = spawn(command, args);
        break;
      case 'go':
        command = 'go';
        args = ['run', '-'];
        process = spawn(command, args);
        break;
      case 'ruby':
        command = 'ruby';
        args = ['-e', code];
        process = spawn(command, args);
        break;
      case 'c':
        command = 'gcc';
        args = ['-x', 'c', '-o', 'a.out', '-'];
        process = spawn(command, args);
        break;
      case 'cpp':
        command = 'g++';
        args = ['-x', 'c++', '-o', 'a.out', '-'];
        process = spawn(command, args);
        break;
      default:
        socket.emit('codeResult', 'Unsupported language');
        return;
    }

    // console.log(process);


    // process.stdin.write(code);
    // process.stdin.end();


    processHeader(process, language, tempFileName);


  });


  const processHeader = (pss, lang, fn) => {
    let output = '';
    let errorOutput = '';

    pss.stdout.on('data', (data) => {

      const strData = data.toString();
      console.log("Output --> " + strData);

      const lines = strData.split('\n').filter(line => line.trim() !== "");

      lines.forEach(line => {
        output = line + '\n'
        socket.emit('output', output);

      });

    });

    pss.stderr.on('data', (data) => {
      socket.emit('output', data.toString());
    });



    pss.on('exit', (code) => {
      if (code !== 0) {
        socket.emit('output', `Error: ${errorOutput || 'Unknown error occurred'}`);
        return;
      }
      // socket.emit("output", output);
      if (lang == 'java') {
        console.log("=== Compilation Success ===");
        socket.emit('output', "=== Compilation Success ===");

        if (fn != null && fn) {
          pss = spawn('java', [fn], {
            cwd: './'
          });

        }
        processHeader(pss, '', fn);
        return;

      }
      socket.emit('output', "=== Code Execution Completed ===");
    });

    socket.on('input', (input) => {
      pss.stdin.write(input + '\n');
    });

    return;
  }

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});




// io.on('connection', (socket) => {
//   console.log('Client connected');

//   // Start the Python process with xterm
//   pythonProcess = spawn('python3', ['-c', `
// while True:
//     user_input = input("Enter something: ")
//     print("Thank you...\\nhi bro")
//     if user_input.lower() == "exit":
//         print("Exiting...")
//         break
//     print(f"Received: {user_input}")
//   `]);

//   // Read Python's output (stdout) and send to client
//   pythonProcess.stdout.on('data', (data) => {
//     socket.emit('output', data.toString());
//   });

//   // Handle Python's stderr
//   pythonProcess.stderr.on('data', (data) => {
//     socket.emit('output', `Error: ${data.toString()}`);
//   });

//   // Handle input from React frontend and send to Python
//   socket.on('input', (input) => {
//     pythonProcess.stdin.write(input + '\n');
//   });

//   // Handle Python process exit
//   socket.on('disconnect', () => {
//     pythonProcess.kill();
//     console.log('Client disconnected');
//   });
// });

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

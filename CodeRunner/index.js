
// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');
// const cors = require('cors');
// const Y = require('yjs');
// const { WebsocketProvider } = require('y-websocket');
// const fs = require('fs').promises;
// const fsSync = require('fs');
// const path = require('path');
// const bodyParser = require('body-parser');
// const { spawn } = require('child_process');
// const { setupWSConnection } = require('y-websocket/bin/utils');

// // Constants
// const MAX_PAYLOAD_SIZE = 50 * 1024 * 1024; // 50MB
// const PORT = process.env.PORT || 3000;
// const MAX_RECONNECTION_ATTEMPTS = 5;
// const RECONNECTION_TIMEOUT = 5000;
// const FILE_OPERATION_TIMEOUT = 10000;

// // Error classes
// class FileOperationError extends Error {
//   constructor(message, path) {
//     super(message);
//     this.name = 'FileOperationError';
//     this.path = path;
//   }
// }

// class WebSocketError extends Error {
//   constructor(message, code) {
//     super(message);
//     this.name = 'WebSocketError';
//     this.code = code;
//   }
// }

// const app = express();
// const server = http.createServer(app);
// global.WebSocket = WebSocket;

// app.use(express.static('public'));
// app.use(bodyParser.text());
// app.use(cors());
// app.use('/codefusion', express.static(path.join(__dirname, 'codefusion')));
// app.use(express.json());

const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const WebSocket = require('ws');

const cors = require('cors');
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const { setupWSConnection } = require('y-websocket/bin/utils');


const app = express();
const server = http.createServer(app);
global.WebSocket = WebSocket;

app.use(express.static('public'));
app.use(bodyParser.text());

app.use(cors())
app.use('/codefusion', express.static(path.join(__dirname, 'codefusion')));

app.use(express.json());

const wss = new WebSocket.Server({
  server: server,
  maxPayload: 50 * 1024 * 1024,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024
  }
});




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/createOrUpdateFile/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log(req.body);

  const { fileName, fileContent } = JSON.parse(req.body);
  // const { fileName, fileContent } = req.body;


  let filePath = path.join(__dirname, 'codefusion');

  console.log(userId, fileName, fileContent);
  console.log("1 " + filePath);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.join(filePath), { recursive: true });
  }
  filePath = path.join(filePath, userId);
  console.log("2 " + filePath);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.join(filePath), { recursive: true });
  }
  console.log("3 " + filePath);

  const Folders = fileName.split("/").filter(i => i);
  const endFile = Folders.pop();
  console.log(Folders);
  console.log(endFile);

  Folders.forEach(fName => {
    filePath = path.join(filePath, fName)
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
  });
  filePath = path.join(filePath, endFile);
  console.log("4 " + filePath);

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      return res.status(500).send('Error creating/updating file');
    }
    console.log(`File '/${userId}/${fileName}' created/updated successfully with the provided content.`);

    res.status(201).send(JSON.stringify({
      userId,
      fileName,
      message: 'File created successfully',
      url: filePath.split(`/${userId}/`)[0]
    }));

  });
});

app.post('/deleteFile', (req, res) => {
  const { deleteFileName } = req.body;

  const filePath = path.join(__dirname, 'codefusion', deleteFileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).send('Error deleting file');
    }
    res.send(`File '${deleteFileName}' deleted successfully.`);
  });
});


app.get('/viewFile/:userId', (req, res) => {

  const userId = req.params.userId;
  const { viewFileName } = req.query;

  const filePath = path.join(__dirname, 'codefusion', userId, viewFileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }
    res.send(`<h2>Content of '${viewFileName}'</h2><pre>${data}</pre>`);
  });
});

app.post('/createFolder/:userId', (req, res) => {
  const userId = req.params.userId;
  const { folderName } = req.body;

  let pathFolder = path.join(__dirname, 'codefusion');

  if (!fs.existsSync(pathFolder)) {
    fs.mkdirSync(path.join(__dirname, 'codefusion'), { recursive: true });
  }

  if (fs.existsSync(path.join(pathFolder, userId, folderName), { recursive: true })) {
    return res.status(202).send('Folder Exists');

  }

  console.log(folderName);

  folderName.split("/").forEach(fName => {
    pathFolder = path.join(pathFolder, fName)
    if (!fs.existsSync(pathFolder)) {
      fs.mkdirSync(pathFolder, { recursive: true });
    }
  })

  return res.status(200).send('Folder Created');

});



app.get('/listFiles', (req, res) => {

  const directoryPath = path.join(__dirname, 'codefusion');
  const userId = req.params.userId;

  if (!fs.existsSync(directoryPath)) {
    return res.status(404).send('No files found');
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send('Error listing files');
    }

    res.send({ files });
  });
});


function getFileContent(path) {
  console.log("Getting file content " + path);

  try {
    const fileData = fs.readFileSync(`/home/arul-zstk404/Documents/JAVA/CodeFusion/CodeRunner${path}`, 'utf8');
    return fileData;
  } catch (err) {
    console.error(`Error reading file: ${path}`);
    return null;
  }

}

app.get('/getFileContent/:filePath', (req, res) => {
  const filePath = req.params.filePath;
  const fileContent = getFileContent(filePath);

  if (fileContent) {
    res.send(JSON.stringify(fileContent));
  } else {
    res.status(404).send('File not found');
  }
});

function getFolders(directory, userId, Folders = []) {
  // console.log("-->" + directory);

  const files = fs.readdirSync(directory);
  console.log(files);

  files.forEach(fileOrFolder => {
    const fullPath = path.join(directory, fileOrFolder);
    const partialPath = path.join((directory.split(`/${userId}/`)[1] || ''), fileOrFolder);

    if (fs.statSync(fullPath).isDirectory()) {
      console.log("--> " + partialPath);
      Folders.push(partialPath);
      return getFolders(fullPath, userId, Folders);
    }
  })

  return Folders;
}

app.get('/getFolders/:userId', (req, res) => {
  const userId = req.params.userId;
  const directoryPath = path.join(__dirname, 'codefusion', userId);

  if (!fs.existsSync(directoryPath)) {
    return res.status(404).send('No files found');
  }

  const fileList = getFolders(directoryPath, userId);

  res.send(fileList);
})


function listFilesInDirectory(directory, fileList = [], result = {}) {
  const files = fs.readdirSync(directory);
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const relativePath = path.relative(__dirname, fullPath);

    if (fs.statSync(fullPath).isDirectory()) {
      let dName = fullPath.split("/").at(-1);
      result[dName] = listFilesInDirectory(fullPath);
      fileList.push(result);
      result = {};
    } else {
      fileList.push({
        "file": file,
        "url": `/${relativePath}`
      });

    }

  });



  return fileList;
}

// function listFilesJSON(directory) {
//   const result = {};

//   const users = fs.readdirSync(directory);

//   users.forEach(user => {
//     const userDirectory = path.join(directory, user);
//     result[user] = listFilesInDirectory(userDirectory);
//   });

//   return result;
// }

app.get('/list-all-files/:userId', (req, res) => {
  const { userId } = req.params;
  try {
    const uploadsDirectory = path.join(__dirname, 'codefusion', userId);
    const fileList = listFilesInDirectory(uploadsDirectory);
    let result = {};
    result[userId] = fileList;
    res.json(result);

  }
  catch (err) {
    console.log(err);
    res.status(404).json({ msg: "No File List found" });

  }
});

// const yCursor = doc.getText('cursor');
let connectedUsers = new Set();
const clientRooms = new Map();
const cursors = new Map();
const docs = new Map();

function disconnectAllSockets() {
  const sockets = io.sockets.sockets;
  console.log(sockets);

  sockets.forEach(socket => {
    socket.disconnect();
  });
  console.log("Sockets disconnected");

}

function getOrUpdateYtext(filePath) {
  let doc;
  if (!docs.has(filePath)) {
    doc = new Y.Doc();
    docs.set(filePath, doc);
    console.log(`Created new Y.Doc for ${filePath}`);
  } else {
    doc = docs.get(filePath);
    console.log(`Reusing existing Y.Doc for ${filePath}`);
  }

  const yt = docs.get(filePath).getText(filePath);
  yt.delete(0, yt.length); // Clear existing content
  console.log(`Cleared Y.Text for ${filePath}`);
  return docs.get(filePath);
}

const processes = new Map();
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const username = url.searchParams.get('username');
  const filePath = url.searchParams.get('filePath');

  if (!username || !filePath) {
    ws.send(JSON.stringify({ error: 'Missing username or file path' }));
    ws.close();
    return;
  }

  console.log("| " + username, filePath);
  // const awareness = new Aware
  clientRooms.set(ws, filePath);

  const doc = getOrUpdateYtext(filePath);

  const currUser = {
    username: username,
    filePath: filePath
  };

  connectedUsers.add(currUser);

  // console.log(connectedUsers, doc.get("monaco").toString() + " END");

  setupWSConnection(ws, req, { doc });

  // console.log(doc);

  console.log("Text -> " + doc.getText(filePath).toString());

  const userList = Array.from(connectedUsers);

  const message = {
    type: 'users',
    users: userList,
    message: `${username} joined the session`
  };

  console.log(`${username} connected. Total users: ${connectedUsers.size}`);

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      return;
    }

    const { language, code } = data;

    if (!language || !code) {
      return;
    }

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
        sendToRoom(wss, filePath, { event: 'codeResult', data: 'Unsupported language' });
        return;
    }

    processes.set(ws, process); 
    processHeader(ws, process, language, tempFileName, filePath);
  });

  // ws.on('message', (message) => {
  //   try {
  //     const data = JSON.parse(message);
  //     console.log('Received message:', data);
  //   } catch (e) {
  //   }
  // });

  ws.on('close', () => {
    connectedUsers.delete(currUser);
    const disconnectMessage = {
      type: 'users',
      users: Array.from(connectedUsers),
      message: `${username} left the session`
    };

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(disconnectMessage));
      }
    });
    // provider.destroy();
    console.log(`${username} disconnected. Total users: ${connectedUsers.size}`);
  });
});



const processHeader = (ws, pss, lang, fn, roomId) => {
  let output = '';
  let errorOutput = '';

  pss.stdout.on('data', (data) => {
    const strData = data.toString();
    console.log("Output --> " + strData);

    const lines = strData.split('\n').filter(line => line.trim() !== "");

    lines.forEach(line => {
      output = line + '\n';
      sendToRoom(wss, roomId, { event: 'output', data: output, input: true });
    });
  });

  pss.stderr.on('data', (data) => {
    errorOutput += data.toString();
    sendToRoom(wss, roomId, { event: 'output', data: errorOutput, input: false });
  });

  pss.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    try {
      wss.close(() => {
        server.close(() => {
          pss.exit(1);
        });
      });
    } catch (e) {
      pss.exit(1);
    }
  });

  pss.on('exit', (code) => {
    if (code !== 0) {
      sendToRoom(wss, roomId, {
        event: 'output',
        data: `Error: ${errorOutput || 'Unknown error occurred'}`
      });
      return;
    }
    if (lang === 'java') {
      console.log("=== Compilation Success ===");
      setTimeout(() => {
        sendToRoom(wss, roomId, { event: 'output', data: "=== Compilation Success ===" });
      }, 500);

      if (fn) {
        pss = spawn('java', [fn], { cwd: './' });
        processes.set(ws, pss);
        processHeader(ws, pss, '', fn, roomId);
      }
      return;
    }
    sendToRoom(wss, roomId, { event: 'output', data: "=== Code Execution Completed ===" });
  });

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      return;
    }
    if (data.event === 'input') {
      pss.stdin.write(data.data + '\n');
    }
  });
};

function sendToRoom(wss, roomId, message) {
  const msg = JSON.stringify(message);
  console.log("Send Msg :" + msg);

  wss.clients.forEach((client) => {
    const clientRoom = clientRooms.get(client);
    console.log("CR --> " + clientRoom, roomId);

    if (clientRoom === roomId && client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});



// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');
// const cors = require('cors');
// const Y = require('yjs');
// const { WebsocketProvider } = require('y-websocket');
// const fs = require('fs').promises;
// const fsSync = require('fs');
// const path = require('path');
// const bodyParser = require('body-parser');
// const { spawn } = require('child_process');
// const { setupWSConnection } = require('y-websocket/bin/utils');

// // Constants
// const MAX_PAYLOAD_SIZE = 50 * 1024 * 1024; // 50MB
// const PORT = process.env.PORT || 3000;
// const MAX_RECONNECTION_ATTEMPTS = 5;
// const RECONNECTION_TIMEOUT = 5000;
// const FILE_OPERATION_TIMEOUT = 10000;

// // Error classes
// class FileOperationError extends Error {
//   constructor(message, path) {
//     super(message);
//     this.name = 'FileOperationError';
//     this.path = path;
//   }
// }

// class WebSocketError extends Error {
//   constructor(message, code) {
//     super(message);
//     this.name = 'WebSocketError';
//     this.code = code;
//   }
// }

// const app = express();
// const server = http.createServer(app);
// global.WebSocket = WebSocket;

// app.use(express.static('public'));
// app.use(bodyParser.text());
// app.use(cors());
// app.use('/codefusion', express.static(path.join(__dirname, 'codefusion')));
// app.use(express.json());

// WebSocket server setup with error handling
// const wss = new WebSocket.Server({
//   server,
//   maxPayload: MAX_PAYLOAD_SIZE,
//   perMessageDeflate: {
//     zlibDeflateOptions: {
//       chunkSize: 1024,
//       memLevel: 7,
//       level: 3
//     },
//     zlibInflateOptions: {
//       chunkSize: 10 * 1024
//     },
//     clientNoContextTakeover: true,
//     serverNoContextTakeover: true,
//     serverMaxWindowBits: 10,
//     concurrencyLimit: 10,
//     threshold: 1024
//   }
// });

// // State management
// const connectedUsers = new Set();
// const clientRooms = new Map();
// const docs = new Map();
// const processes = new Map();
// const reconnectionAttempts = new Map();

// // Utility functions
// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// const safeJSONParse = (str) => {
//   try {
//     return JSON.parse(str);
//   } catch (e) {
//     return null;
//   }
// };

// // File system operations with error handling
// async function ensureDirectory(dirPath) {
//   try {
//     await fs.access(dirPath);
//   } catch {
//     await fs.mkdir(dirPath, { recursive: true });
//   }
// }

// async function writeFileWithRetry(filePath, content, attempts = 3) {
//   for (let i = 0; i < attempts; i++) {
//     try {
//       await fs.writeFile(filePath, content);
//       return;
//     } catch (err) {
//       if (i === attempts - 1) throw err;
//       await sleep(1000);
//     }
//   }
// }

// // Enhanced Y.js document management
// function getOrUpdateYtext(filePath) {
//   try {
//     let doc = docs.get(filePath);
//     if (!doc) {
//       doc = new Y.Doc();
//       docs.set(filePath, doc);
//       console.log(`Created new Y.Doc for ${filePath}`);
//     }

//     const ytext = doc.getText(filePath);
//     ytext.delete(0, ytext.length);
//     return doc;
//   } catch (error) {
//     console.error(`Error in Y.js document management: ${error.message}`);
//     throw new Error('Failed to initialize document');
//   }
// }

// // Process management
// function killProcess(ws) {
//   const process = processes.get(ws);
//   if (process) {
//     try {
//       process.kill('SIGTERM');
//       setTimeout(() => {
//         if (!process.killed) {
//           process.kill('SIGKILL');
//         }
//       }, 5000);
//     } catch (error) {
//       console.error(`Error killing process: ${error.message}`);
//     }
//     processes.delete(ws);
//   }
// }

// // WebSocket connection handler
// wss.on('connection', async (ws, req) => {
//   let username, filePath;

//   try {
//     const url = new URL(req.url, `http://${req.headers.host}`);
//     username = url.searchParams.get('username');
//     filePath = url.searchParams.get('filePath');

//     if (!username || !filePath) {
//       throw new WebSocketError('Missing username or file path', 4000);
//     }

//     clientRooms.set(ws, filePath);
//     const doc = getOrUpdateYtext(filePath);

//     const currUser = { username, filePath };
//     connectedUsers.add(currUser);

//     setupWSConnection(ws, req, { doc });

//     const userList = Array.from(connectedUsers);
//     broadcastToRoom(filePath, {
//       type: 'users',
//       users: userList,
//       message: `${username} joined the session`
//     });

//     ws.on('message', async (message) => {
//       const data = safeJSONParse(message);
//       if (!data) return;

//       if (data.event === 'code') {
//         await handleCodeExecution(ws, data, filePath);
//       } else if (data.event === 'input') {
//         handleProcessInput(ws, data);
//       }
//     });

//     ws.on('close', () => handleDisconnect(ws, currUser));

//     ws.on('error', (error) => handleWebSocketError(ws, error));

//   } catch (error) {
//     handleConnectionError(ws, error);
//   }
// });

// // Code execution handler
// async function handleCodeExecution(ws, data, roomId) {
//   const { language, code } = data;
//   if (!language || !code) return;

//   try {
//     killProcess(ws); // Kill any existing process

//     const config = getLanguageConfig(language);
//     if (!config) {
//       throw new Error('Unsupported language');
//     }

//     const process = await spawnProcess(config, code);
//     processes.set(ws, process);
//     setupProcessHandlers(ws, process, config, roomId);

//   } catch (error) {
//     sendToRoom(wss, roomId, {
//       event: 'error',
//       data: `Execution error: ${error.message}`
//     });
//   }
// }

// // Language configuration
// function getLanguageConfig(language) {
//   const configs = {
//     python: { command: 'python3', args: ['-c'] },
//     javascript: { command: 'node', args: ['-e'] },
//     java: { command: 'javac', tempFile: true, className: 'TempCode' },
//     go: { command: 'go', args: ['run', '-'] },
//     ruby: { command: 'ruby', args: ['-e'] },
//     c: { command: 'gcc', args: ['-x', 'c', '-o', 'a.out', '-'] },
//     cpp: { command: 'g++', args: ['-x', 'c++', '-o', 'a.out', '-'] }
//   };
//   return configs[language];
// }

// // Process spawning and handling
// async function spawnProcess(config, code) {
//   let process;
//   if (config.tempFile) {
//     const filePath = `./${config.className}.java`;
//     await writeFileWithRetry(filePath, code);
//     process = spawn(config.command, [filePath]);
//   } else {
//     process = spawn(config.command, [...config.args, code]);
//   }
//   return process;
// }

// function setupProcessHandlers(ws, process, config, roomId) {
//   let output = '';
//   let errorOutput = '';

//   process.stdout.on('data', (data) => {
//     handleProcessOutput(data, true, roomId);
//   });

//   process.stderr.on('data', (data) => {
//     handleProcessOutput(data, false, roomId);
//   });

//   process.on('error', (error) => {
//     handleProcessError(error, roomId);
//   });

//   process.on('exit', (code) => {
//     handleProcessExit(code, config, errorOutput, roomId);
//   });
// }

// // Broadcast helpers
// function broadcastToRoom(roomId, message) {
//   const msg = JSON.stringify(message);
//   wss.clients.forEach((client) => {
//     if (clientRooms.get(client) === roomId && client.readyState === WebSocket.OPEN) {
//       client.send(msg);
//     }
//   });
// }

// // Error handlers
// function handleConnectionError(ws, error) {
//   console.error(`Connection error: ${error.message}`);
//   ws.send(JSON.stringify({
//     type: 'error',
//     message: 'Failed to establish connection'
//   }));
//   ws.close(4000, error.message);
// }

// function handleWebSocketError(ws, error) {
//   console.error(`WebSocket error: ${error.message}`);
//   try {
//     ws.send(JSON.stringify({
//       type: 'error',
//       message: 'WebSocket error occurred'
//     }));
//   } catch (e) {
//     // Connection might be already closed
//   }
// }

// function handleDisconnect(ws, user) {
//   connectedUsers.delete(user);
//   clientRooms.delete(ws);
//   killProcess(ws);

//   broadcastToRoom(user.filePath, {
//     type: 'users',
//     users: Array.from(connectedUsers),
//     message: `${user.username} left the session`
//   });
// }

// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// }).on('error', (error) => {
//   console.error(`Server failed to start: ${error.message}`);
//   process.exit(1);
// });

// process.on('SIGTERM', gracefulShutdown);
// process.on('SIGINT', gracefulShutdown);

// async function gracefulShutdown() {
//   console.log('Initiating graceful shutdown...');

//   wss.clients.forEach(client => {
//     try {
//       client.close(1000, 'Server shutting down');
//     } catch (e) {
//       console.error('Error closing WebSocket connection:', e);
//     }
//   });

//   processes.forEach((process) => {
//     try {
//       process.kill('SIGTERM');
//     } catch (e) {
//       console.error('Error killing process:', e);
//     }
//   });

//   server.close(() => {
//     console.log('Server shut down complete');
//     process.exit(0);
//   });

//   setTimeout(() => {
//     console.error('Forced shutdown due to timeout');
//     process.exit(1);
//   }, 10000);
// }
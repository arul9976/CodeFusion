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
// const io = socketIo(server, {
//   cors: {
//     origin: '*',
//     // origin: 'http://localhost:3001',
//     // origin: 'http://172.17.22.225:3001',
//     methods: ['GET', 'POST'],
//   },
// });

app.use(express.static('public'));
app.use(bodyParser.text());

app.use(cors())
app.use('/codefusion', express.static(path.join(__dirname, 'codefusion')));

app.use(express.json());

const wss = new WebSocket.Server({
  server: server
});




app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/createOrUpdateFile/:userId', (req, res) => {
  const userId = req.params.userId;
  const { fileName, fileContent } = req.body;

  let filePath = path.join(__dirname, 'codefusion');

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.join(filePath), { recursive: true });
  }
  filePath = path.join(__dirname, userId);

  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.join(filePath), { recursive: true });
  }

  if (fs.existsSync(path.join(filePath, fileName), { recursive: true })) {
    return res.status(202).send('Folder Exists');

  }

  fileName.split("/").forEach(fName => {
    filePath = path.join(filePath, fName)
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
  })

  fs.writeFile(filePath, fileContent, (err) => {
    if (err) {
      return res.status(500).send('Error creating/updating file');
    }
    console.log(`File '/${userId}/${fileName}' created/updated successfully with the provided content.`);
    res.send(`File '/${userId}/${fileName}' created/updated successfully with the provided content.`);
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
      // result[directory.split("/").at(-1)] = listFilesInDirectory(fullPath, [], result);
    } else {
      // fileList.push(`/${relativePath}`);
      // console.log("Full Path " + fullPath);
      const fileData = fs.readFileSync(fullPath, 'utf8');

      fileList.push({
        "file": file,
        "url": `/${relativePath}`
      });

      // result[directory.split("/").at(-1)] = ;

    }

  });
  // if (result)
  // fileList.push(result);



  return fileList;
}

function listFilesJSON(directory) {
  const result = {};

  const users = fs.readdirSync(directory);

  users.forEach(user => {
    const userDirectory = path.join(directory, user);
    result[user] = listFilesInDirectory(userDirectory);

    //   const projects = fs.readdirSync(userDirectory);
    //   result[user] = {};

    //   projects.forEach(project => {

    //     const projectDirectory = path.join(userDirectory, project);
    //     if (fs.statSync(projectDirectory).isDirectory()) {
    //       console.log(project);

    //       const files = fs.readdirSync(projectDirectory);
    //       result[user][project] = files.map(file => {
    //         return {
    //           "file": file,
    //           "url": `/uploads/${user}/${project}/${file}`
    //         };
    //       });
    //     } else { }
    //   });

  });

  return result;
}

// function listFilesInDirectory(directory) {
//   const result = {};

//   const users = fs.readdirSync(directory);

//   users.forEach(user => {
//     const userDir = path.join(directory, user);
//     if (fs.statSync(userDir).isDirectory()) {
//       const userProjects = fs.readdirSync(userDir);
//       result[user] = {};

//       userProjects.forEach(project => {
//         const projectDir = path.join(userDir, project);
//         if (fs.statSync(projectDir).isDirectory()) {
//           result[user][project] = listFilesInDirectory(projectDir);
//          } else {
//           result[user][project] = {
//             file: project,
//             url: `/codefusion/${user}/${project}`
//           };
//         }
//       });
//     }
//   });

//   return result;
// }

// API to list files and directories (recursive)
app.get('/list-all-files/:userId', (req, res) => {
  const { userId } = req.params;
  const uploadsDirectory = path.join(__dirname, 'codefusion', userId);
  const fileList = listFilesInDirectory(uploadsDirectory);
  let result = {};
  result[userId] = fileList;
  res.json(result);
});

// const yCursor = doc.getText('cursor');
let connectedUsers = new Set();

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


  const doc = getOrUpdateYtext(filePath);

  const currUser = {
    username: username,
    filePath: filePath
  };

  connectedUsers.add(currUser);

  // console.log(connectedUsers, doc.get("monaco").toString() + " END");

  setupWSConnection(ws, req, { doc });

  // console.log(doc);

  console.log("Text -> " + doc.getText("monaco").toString());

  const userList = Array.from(connectedUsers);

  const message = {
    type: 'users',
    users: userList,
    message: `${username} joined the session`
  };



  // wss.clients.forEach(client => {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(JSON.stringify(message));
  //   }
  // });

  console.log(`${username} connected. Total users: ${connectedUsers.size}`);

  // console.log(ydoc);

  // const provider = new WebsocketProvider('ws://localhost:3000', filePath, ydoc);

  // provider.awareness.setLocalState({
  //   'user': currUser,
  //   'userList': userList,
  // });

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);
    } catch (e) {
    }
  });

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

// io.on('connection', (socket) => {
//   // disconnectAllSockets()
//   console.log(`\nUser Connected --> ${socket.id}\n`);
//   cursors.set(socket.id, { row: 0, column: 0 });


//   socket.on('newuser', (data) => {
//     console.log('UserConnected ', data);
//     socket.broadcast.emit('newuser', { message: 'You are now connected!' });

//   });

//   // socket.on('join-room', (roomId) => {
//   //   socket.join(roomId);
//   //   console.log(`${socket.id} joined room ${roomId}`);
//   //   console.log(socket.rooms);
//   //   // socket.broadcast.emit('sync', { update: yText.toString() });
//   //   socket.to(roomId).emit('sync', "{ update: yText }");
//   //   // socket.to(roomId).broadcast.emit('sync', "{ update: yText }");
//   // });


//   // socket.to(roomId).emit('sync', { update: yText });

//   socket.on('fileOpenAndDocCreate', (data) => {
//     console.log(docs);

//     console.log('fileOpenAndDocCreate Loaded');
//     const { path, content } = data;
//     console.log(path);

//     const ydoc = getOrUpdateYtext(path);
//     const yText = ydoc.getText("editor");
//     if (yText.toString().length === 0)
//       yText.insert(0, content);

//     console.log(yText.toString());

//     socket.emit('fileLoaded', { content: yText.toString(), statusCode: 200, id: socket.id });

//   })

//   socket.on('codeUpdate', (data) => {
//     // console.log(docs);

//     const { pendingDeltas, path } = data;
//     // console.log(pendingDeltas, path);

//     const ydoc = getOrUpdateYtext(path);
//     const yText = ydoc.getText("editor");

//     pendingDeltas.forEach(d => {

//       const { cursor, yDelta, aceDelta } = d;
//       const { action, start, end, lines, totalLines } = yDelta;
//       let s = start;

//       // cursors.set(socket.id, cursor);
//       if (lines !== yText.toString()) {
//         console.log("\nDelta ==> " + start, end, lines, action);

//         console.log("\nBefore\n" + yText.toString());

//         if (action == 'insert') {
//           console.log(yText.toString().split('\n').length, totalLines, (yText.toString().split('\n').length - totalLines));
//           let n = (yText.toString().split('\n').length - totalLines);
//           // s += n > 0 ? n : 0;

//           ydoc.transact(() => {
//             yText.delete(start, 0);
//             yText.insert(s, lines);
//           });
//         }
//         else if (action == 'remove') {
//           ydoc.transact(() => {
//             yText.delete(start, lines.length);
//           })
//         }
//       }
//     });

//     // yText.applyDelta([{ delete: 0 }, ...retains]);
//     console.log("\nAfter\n" + yText.toString());

//     socket.broadcast.emit('updatedCode', { cursors: Array.from(cursors), pendingDeltas, path });
//     console.log("\n--> BroadCast Successfully <--\n");


//   });

//   socket.on('output', (data) => {
//     const { language, code } = data;
//     console.log("Code : " + code + "\nLanguage : " + language);

//     let command = '';
//     let args = [];
//     let process;
//     let tempFileName;

//     switch (language) {
//       case 'python':
//         command = 'python3';
//         args = ['-c', code];
//         process = spawn(command, args);
//         break;
//       case 'javascript':
//         command = 'node';
//         args = ['-e', code];
//         process = spawn(command, args);
//         break;
//       case 'java':
//         tempFileName = 'TempCode';
//         let fileNameWithPath = `./${tempFileName}.java`;
//         fs.writeFileSync(fileNameWithPath, code);
//         command = 'javac';
//         args = [fileNameWithPath];
//         process = spawn(command, args);
//         break;
//       case 'go':
//         command = 'go';
//         args = ['run', '-'];
//         process = spawn(command, args);
//         break;
//       case 'ruby':
//         command = 'ruby';
//         args = ['-e', code];
//         process = spawn(command, args);
//         break;
//       case 'c':
//         command = 'gcc';
//         args = ['-x', 'c', '-o', 'a.out', '-'];
//         process = spawn(command, args);
//         break;
//       case 'cpp':
//         command = 'g++';
//         args = ['-x', 'c++', '-o', 'a.out', '-'];
//         process = spawn(command, args);
//         break;
//       default:
//         socket.to(roomId).emit('codeResult', 'Unsupported language');
//         return;
//     }

//     processHeader(process, language, tempFileName);


//   });


//   const processHeader = (pss, lang, fn) => {
//     let output = '';
//     let errorOutput = '';

//     pss.stdout.on('data', (data) => {

//       const strData = data.toString();
//       console.log("Output --> " + strData);

//       const lines = strData.split('\n').filter(line => line.trim() !== "");

//       lines.forEach(line => {
//         output = line + '\n'
//         socket.to(roomId).emit('output', output);

//       });

//     });

//     pss.stderr.on('data', (data) => {
//       socket.to(roomId).emit('output', data.toString());
//     });



//     pss.on('exit', (code) => {
//       if (code !== 0) {
//         socket.to(roomId).emit('output', `Error: ${errorOutput || 'Unknown error occurred'}`);
//         return;
//       }
//       // socket.to(roomId).emit("output", output);
//       if (lang == 'java') {
//         console.log("=== Compilation Success ===");
//         socket.to(roomId).emit('output', "=== Compilation Success ===");

//         if (fn != null && fn) {
//           pss = spawn('java', [fn], {
//             cwd: './'
//           });

//         }
//         processHeader(pss, '', fn);
//         return;

//       }
//       socket.to(roomId).emit('output', "=== Code Execution Completed ===");
//     });

//     socket.on('input', (input) => {
//       pss.stdin.write(input + '\n');
//     });

//     return;
//   }

//   socket.on('leave-room', (roomId) => {
//     socket.leave(roomId);
//     console.log(`${socket.id} left room ${roomId}`);
//     socket.to(roomId).emit('message', `${socket.id} has left the room`);
//   });


//   socket.on('/clearSockets', disconnectAllSockets)

//   socket.on('disconnect', () => {
//     console.log('User disconnected ' + socket.id);
//   });
// });


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});



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

// import { CompletionCopilot } from 'monacopilot';

const express = require('express');
const http = require('http');
// const socketIo = require('socket.io');
const WebSocket = require('ws');

const { CompletionCopilot } = require('monacopilot');

const cors = require('cors');
const Y = require('yjs');
const { WebsocketProvider } = require('y-websocket');
const fs = require('fs-extra');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const { setupWSConnection } = require('y-websocket/bin/utils');



const MISTRAL_API_KEY = '2cQ0N6eY5XGok55SX8VrzMp6N74Cyjbg';

const copilot = new CompletionCopilot(MISTRAL_API_KEY, {
  provider: 'mistral',
  model: 'codestral',
});


const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
global.WebSocket = WebSocket;

app.use(express.static('public'));
app.use(bodyParser.text());

const corsOptions = {
  origin: 'http://localhost:3001',
  methods: 'GET, POST',
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions))
app.use('/codefusion', express.static(path.join(__dirname, 'codefusion')));

app.use('/codefusion/:username/profile/', (req, res, next) => {
  const { username } = req.params;
  const imagePath = path.join(__dirname, 'codefusion', username, 'profile', req.path);
  console.log(imagePath);

  // Check if the file exists
  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).send('Image not found');
    }
  });
});
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.params.userId || req.body.userId;

    const uploadPath = path.join(__dirname, 'codefusion', userId, "profile");
    console.log(uploadPath);


    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and GIF images are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

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


const languages = (name, lang) => {
  const langs = {
    c: `#include <stdio.h>

void sayHello() {
    printf("Hello, World!\\n");
}

int main() {
    sayHello();
    return 0;
}`,

    cpp: `#include <iostream>

void sayHello() {
    std::cout << "Hello, World!" << std::endl;
}

int main() {
    sayHello();
    return 0;
}`,

    py: `# Function to print Hello, World!
def say_hello():
    print("Hello, World!")

# Call the function
say_hello()`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello, World!</title>
    <script>
        function sayHello() {
            alert("Hello, World!");
        }
    </script>
</head>
<body>
    <h1>Click the button to see the message!</h1>
    <button onclick="sayHello()">Say Hello</button>
</body>
</html>`,

    css: `/* Define a CSS class */
.hello-world {
    font-size: 24px;
    color: green;
    text-align: center;
}`,

    rb: `# Function to print Hello, World!
def say_hello
  puts "Hello, World!"
end

# Call the function
say_hello`,

    go: `package main

import "fmt"

// Function to print Hello, World!
func sayHello() {
    fmt.Println("Hello, World!")
}

func main() {
    sayHello()
}`,


    java: (name) => `public class ${name} {
    // Function to print Hello, World!
    public static void sayHello() {
        System.out.println("Hello, World!");
    }

    public static void main(String[] args) {
        sayHello();
    }
}`,

    js: `// Function to print Hello, World!
function sayHello() {
    console.log("Hello, World!");
}

// Call the function
sayHello();`
  }

  if (lang === 'java') {
    return langs[lang](name);
  }
  return langs[lang]
};


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/createOrUpdateFile/:userId/:wsName', (req, res) => {
  const { userId, wsName } = req.params;
  // console.log(req.body);
  console.log(userId, wsName);

  const { fileName, fileContent } = JSON.parse(req.body);

  let filePath = path.join(__dirname, 'codefusion', userId, wsName);

  try {

    fs.mkdirSync(path.join(filePath), { recursive: true });
    filePath = path.join(filePath, fileName);
    console.log(filePath);

    if (fileName.split(".").length > 1) {
      let nameFile = fileName.split(".");
      fs.writeFileSync(filePath, (fileContent || languages(nameFile[0].substr(1), nameFile[1])), 'utf8')
    }
    else {
      fs.mkdirSync(filePath, { recursive: true });
    }
    console.log(`File '/${userId}/${fileName}' created/updated successfully with the provided content.`);

    res.status(201).send(JSON.stringify({
      status: true,
      userId,
      fileName,
      message: `${fileName.split(".").length > 1 ? 'File' : 'Folder'} created successfully`,
      url: filePath.split(`/${userId}/`)[0]
    }));

  } catch (err) {
    console.log(err.message);

    return res.status(500).send('Error creating/updating file');

  };
});

// app.post('/deleteFile', (req, res) => {
//   const { deleteFileName } = req.body;

//   const filePath = path.join(__dirname, 'codefusion', deleteFileName);

//   if (!fs.existsSync(filePath)) {
//     return res.status(404).send('File not found');
//   }

//   fs.unlink(filePath, (err) => {
//     if (err) {
//       return res.status(500).send('Error deleting file');
//     }
//     res.send(`File '${deleteFileName}' deleted successfully.`);
//   });
// });


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
    console.log(`Error reading file: ${path}`);
    return null;
  }

}

const saveFile = (path, code) => {
  console.log(path, code);

  if (fs.statSync(path).isFile) {
    fs.writeFileSync(path, code, 'utf8');
  }
  else {
    throw new Error('File not found: ' + path);
  }
}

app.post('/saveFile', (req, res) => {
  const { fileId, code } = req.body;
  const filePath = path.join(__dirname, fileId);
  console.log("File Path: " + filePath);

  try {
    saveFile(filePath, code);
    res.status(200).send({ message: 'File saved successfully', statusCode: 200 });
  } catch (e) {
    console.log(e);
    res.status(500).send('Error saving file');
  }
})

app.get('/getFileContent/:filePath', (req, res) => {
  const filePath = req.params.filePath;
  try {
    const fileContent = getFileContent(filePath);
    if (fileContent) {
      res.status(200).send(JSON.stringify(fileContent));
    } else {
      res.status(404).send('File not found');
    }
  } catch (e) {
    res.status(500).send('Error Getting file content');

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



app.post('/uploadProficPic/:userId', upload.single('profilePic'), (req, res) => {
  try {
    console.log(req.file);

    if (!req.file) {
      return res.status(204).json({ message: 'No image uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/codefusion/${req.params.userId}/profile/${req.file.filename}`;

    res.status(200).json({
      message: 'Image uploaded successfully',
      fileUrl: fileUrl,
      filePath: req.file.path,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

app.get('/getFolders/:userId/:wsName', (req, res) => {
  const { userId, wsName } = req.params;
  const directoryPath = path.join(__dirname, 'codefusion', userId, wsName);

  if (!fs.existsSync(directoryPath)) {
    return res.status(404).send('No files found');
  }
  try {
    const fileList = getFolders(directoryPath, wsName);

    res.send(fileList);
  } catch (e) {
    console.log(e);
    res.status(500).send('Error getting folders');
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
    } else if (isProgramicFile(file.split(".")[1])) {
      fileList.push({
        "file": file,
        "url": `/${relativePath}`
      });

    }

  });



  return fileList;
}

const isProgramicFile = (extension) => {
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'css':
    case 'scss':
    case 'less':
      return 'css';
    case 'html':
      return 'html';
    case 'py':
    case 'pyw':
      return 'python';
    case 'java':
      return 'java';
    case 'php':
      return 'php';
    case 'c':
    case 'cpp':
    case 'h':
    case 'hpp':
      return 'c_cpp';
    case 'rb':
      return 'ruby';
    case 'go':
      return 'golang';
    case 'json':
      return 'json';
    case 'md':
    case 'markdown':
      return 'markdown';
    default:
      return false;
  }

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

function deleteFileSync(path, type) {
  console.log("Delete Path --> " + path);

  try {
    if (!fs.existsSync(path)) {
      return {
        success: true,
        message: `${type} not exists`
      }
    }
    if (type === 'folder') {
      fs.rmSync(path, { recursive: true, force: true })
    } else if (type === 'file') {
      fs.unlinkSync(path);
    }
    console.log(`${type} ${path} deleted successfully`);
    return {
      success: true,
      message: `${type} deleted successfully`
    }
  } catch (error) {
    console.error(`Error deleting ${type} ${path}:`, error);
    return {
      success: false,
      message: `${type} deleted failed`
    }
  }
}

function renameFileSync(path, newName) {
  try {

    if (!fs.existsSync(path)) {
      throw new Error(`Source file '${path}' does not exist`);
    }

    const stats = fs.statSync(path);
    if (!stats.isFile()) {
      throw new Error(`Source path '${path}' is not a file`);
    }

    if (fs.existsSync(newName)) {
      throw new Error(`Destination file '${newName}' already exists`);
    }

    fs.renameSync(path, newName);
    console.log(`File renamed from ${path} to ${newName} successfully`);
    return {
      success: true,
      message: `File renamed successfully`
    }
  } catch (error) {
    console.error(`Error renaming file from ${path} to ${newName}:`, error);
    return {
      success: false,
      message: error.message
    }
  }
}

const renameFolder = (sourcePath, newName, itemType) => {
  console.log(sourcePath + "\n" + newName);

  try {

    const stats = fs.statSync(sourcePath);
    if ((itemType === 'file' && !stats.isFile()) ||
      (itemType === 'folder' && !stats.isDirectory())) {
      throw new Error(`Path '${sourcePath}' is not a ${itemType}`);
    }

    if (fs.existsSync(newName)) {
      throw new Error(`'${newName}' already exists`);
    }

    fs.renameSync(sourcePath, newName);
    return {
      success: true,
      message: `Folder renamed successfully`
    }
  } catch (e) {
    console.error(`Error renaming ${itemType} from ${sourcePath} to ${newName}:`, e.message);
    return {
      success: false,
      message: error.message
    }
  }
}


app.post("/rename", (req, res) => {
  const { url, newName, type } = req.body;

  try {
    const oldPath = path.join(__dirname, url);
    const newPath = path.join(__dirname, newName);
    console.log("---> " + oldPath + "\n---> " + newPath + "\n---> " + type);
    let result;
    switch (type) {
      case 'file':
        result = renameFileSync(oldPath + "", newPath + "")
        console.log(result);
        break;

      case 'folder':
        result = renameFolder(oldPath + "", newPath + "", type);
        break;

      default:
        result = {
          success: false,
          message: 'Type is Not Permitted'
        }
    }
    console.log(result);
    res.status(200).send(result);
  } catch (error) {
    result = {
      success: false,
      message: error.message
    }
  }
})

const pasteFolder = (sPath, dPath, type) => {
  try {
    const sourcePath = path.resolve(sPath);
    const destPath = path.resolve(dPath);

    console.log("-> " + sourcePath + "\n-> " + destPath);

    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source folder does not exist');
    }

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    fs.copySync(sourcePath, destPath, { recursive: true });

    if (type === 'cut') {
      fs.unlinkSync(sourcePath);
    }
    return {
      success: true,
      message: 'Folder copied successfully'
    };

  }
  catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

function copyDirSync(sourcePath, destPath, type) {
  try {

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath, { recursive: true });
    }

    const items = fs.readdirSync(sourcePath, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(sourcePath, item.name);
      const dstPath = path.join(destPath, item.name);

      if (item.isDirectory()) {
        copyDirSync(srcPath, dstPath);
      } else {
        fs.copyFileSync(srcPath, dstPath);
      }
    }

    if (type === 'cut') {
      fs.rmSync(sourcePath, { recursive: true, force: true })
    }

    return {
      success: true,
      message: 'Folder copied successfully'
    };

  }
  catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

function pasteToFolder(pathToCopy, fileToCopy, type) {
  try {
    const sourcePath = path.resolve(fileToCopy);
    const destPath = path.resolve(path.join(pathToCopy, path.basename(fileToCopy)));

    console.log("---> " + sourcePath + "\n---> " + destPath + "\n---> " + type);

    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source file does not exist');
    }

    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copySync(sourcePath, destPath, { overwrite: true });

    if (type.toLowerCase() === 'cut') {
      fs.unlinkSync(sourcePath);
    }

    return {
      success: true,
      message: `File ${type.toLowerCase() === 'cut' ? 'moved' : 'copied'} successfully`
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

app.post('/pasteFile', (req, res) => {
  const { pastePath, file, type, fileType } = req.body;
  const pasteToPath = path.join(__dirname, 'codefusion', pastePath);
  const fromPath = path.join(__dirname, file);

  console.log(pasteToPath + "\n" + fromPath + "\n" + type + "\n" + fileType);

  switch (fileType) {
    case 'file':
      res.json(pasteToFolder(pasteToPath, fromPath, type));
      break;
    case 'folder':
      // let src = pasteToPath.split('/');
      let dest = pasteToPath + '/' + file.split('/').pop();
      res.json(copyDirSync(fromPath, dest, type));
      break;
    default:
  }

});

app.post("/deletefile", (req, res) => {


  try {
    const { url, type } = req.body;
    const filePath = path.join(__dirname, url);
    console.log("---> " + filePath);
    const result = deleteFileSync(filePath, type);
    console.log(result);
    res.status(200).send(result);
  } catch (error) {
    res.send({
      success: false,
      message: error.message
    })
  }
});


app.post('/code-completion', async (req, res) => {
  console.log("Code Completion hited");

  const { completion, error, raw } = await copilot.complete({ body: req.body });

  console.log("Completion " + completion);
  console.log("Raw " + raw);

  // if (raw) {
  //   calculateCost(raw.usage.input_tokens);
  // }

  if (error) {
    return res.status(500).json({ completion: null, error });
  }

  res.json({ completion });
});

app.get('/list-all-files/:userId/:ws', (req, res) => {
  const { userId, ws } = req.params;
  try {
    console.log(userId, ws);

    const uploadsDirectory = path.join(__dirname, 'codefusion', userId, ws);
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
const clientRooms = new Map();
const editors = new Map();
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
  yt.delete(0, yt.length);
  console.log(`Cleared Y.Text for ${filePath}`);
  return docs.get(filePath);
}

const processes = new Map();
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const username = url.searchParams.get('username');
  const fullRoomId = url.searchParams.get('fullRoomId');

  if (fullRoomId) {
    console.log("Full Room Id: " + fullRoomId);
    if (!editors.has(fullRoomId)) {
      editors.set(fullRoomId, new Set());

    }
    editors.get(fullRoomId).add(ws);
    setupWSConnection(ws, req);

    console.log("Editors\n", Array.from(editors));
    return;
  }
  let roomId = url.searchParams.get('roomId') || url.searchParams.get('filePath');

  console.log("ROOM ID: " + roomId);

  if (!username || !roomId) {
    ws.send(JSON.stringify({ event: "Connection Error", error: 'Missing username or file path' }));
    ws.close();
    return;
  }

  ws.id = uuidv4();

  console.log("ID ------> ", ws.id);

  console.log("--> Room " + username + "\nRoom ID " + roomId);


  if (!clientRooms.has(roomId)) {
    console.log("Room Added");
    clientRooms.set(roomId, new Map());
  }


  clientRooms.get(roomId).set(username, ws);


  console.log("Client Room Created ");


  // const doc = getOrUpdateYtext(filePath);

  // const currUser = {
  //   username: username,
  //   roomId: roomId
  // };

  // connectedUsers.add(currUser);

  // console.log(connectedUsers, doc.get("monaco").toString() + " END");

  // setupWSConnection(ws, req, { doc });

  // console.log(doc);

  // console.log("Text -> " + doc.getText(filePath).toString());

  const userList = Array.from(clientRooms);
  console.log(userList, clientRooms.get(roomId).size);

  const message = {
    type: 'users',
    users: userList,
    message: `${username} joined the session`
  };

  console.log(`${username} connected. Total users: ${userList.length}`);

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (e) {
      console.log("Editors Message\n" + editors);

      return;
    }

    if (data) {

      switch (data.event) {


        case 'file_system':
          console.log("File Created ", data.message);
          // const { roomId } = data;
          console.log("RoomId ", data.roomId);

          clientRooms.get(data.roomId)?.forEach((client, un) => {
            console.log("Entered ", un);

            if (un !== username && client.readyState === WebSocket.OPEN) {
              console.log("Send to ", un);
              client.send(JSON.stringify({
                event: 'file_system',
                message: data.message
              }));
            }
          })
          break;

        case 'chat':
          console.log("Message From Client ", data.message);
          const { message } = data;
          clientRooms.get(message.roomId).forEach((client, un) => {
            console.log(message.receiver);
            if (message.receiver === 'All' && (message.sender !== un) && client.readyState === WebSocket.OPEN) {
              console.log("Message send to all clients ", un, client.id);

              client.send(JSON.stringify({
                event: 'chat',
                message: message
              }));
            } else {
              console.log(un, message.receiver);
              if (message.receiver == un && client.readyState === WebSocket.OPEN) {
                console.log("Message send to all clients ", un, client.id);

                client.send(JSON.stringify({
                  event: 'chat',
                  message: message
                }));
              }
            }
          })
          break;

        case 'joinRoom':
          console.log("<<<<<<---> ", data.message);

          break;

        case 'compile':
          const { language, code, fpath } = data;

          if (!language || !code) {
            return;
          }

          console.log("Code : " + code + "\nLanguage : " + language + "\nFpath : " + fpath);

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
              tempFileName = fpath.split('/').at(-1).split('.')[0];
              console.log("File Name : " + tempFileName);

              let fileNameWithPath = "." + fpath;
              fs.writeFileSync(fileNameWithPath, code);
              command = 'javac';
              args = [fileNameWithPath];
              process = spawn(command, args);
              break;
            case 'golang':
              console.log("golang --> " + language);
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
              sendToRoom(wss, roomId, { event: 'codeResult', data: 'Unsupported language' });
              return;
          }

          processes.set(ws, process);
          processHeader(ws, process, language, tempFileName, roomId, fpath);
          break;
      }
    }
  });

  // ws.on('message', (message) => {
  //   try {
  //     const data = JSON.parse(message);
  //     console.log('Received message:', data);
  //   } catch (e) {
  //   }
  // });

  ws.on('close', () => {
    clientRooms.get(roomId).delete(username);
    const disconnectMessage = {
      type: 'users',
      users: userList,
      message: `${username} left the session`
    };

    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(disconnectMessage));
      }
    });
    // provider.destroy();
    console.log(`${username} disconnected. Total users: ${userList.size}`);
  });
});



const processHeader = (ws, pss, lang, fn, roomId, filePath) => {
  let output = '';
  let errorOutput = '';

  pss.stdout.on('data', (data) => {
    const strData = data.toString();
    console.log("Output --> " + strData);

    const lines = strData.split('\n').filter(line => line.trim() !== "");

    // lines.forEach(line => {
    //   output = line + '\n';
    // });

    sendToRoom(wss, roomId, { event: 'output', data: lines, input: true });

  });

  pss.stderr.on('data', (data) => {
    errorOutput += data.toString();
    sendToRoom(wss, roomId, { event: 'error', data: errorOutput, input: false });
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
        event: 'error',
        data: `Error: ${errorOutput || 'Unknown error occurred'}`
      });
      return;
    }
    if (lang === 'java') {
      console.log("=== Compilation Success ===");
      // setTimeout(() => {
      //   sendToRoom(wss, roomId, { event: 'output', data: "=== Compilation Success ===" });
      // }, 500);

      if (fn) {
        console.log(fn + " --- " + filePath.split('/').filter((v, i, a) => i !== a.length - 1).join('/')) + '/';
        let newpath = filePath.split('/').filter((v, i, a) => i !== a.length - 1).join('/') + '/';

        pss = spawn('java', [fn], { cwd: ('.' + newpath) });
        processes.set(ws, pss);
        processHeader(ws, pss, '', fn, roomId);
      }
      return;
    }
    sendToRoom(wss, roomId, { event: 'output', data: ["=== Code Execution Completed ==="], input: false });
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

  console.log("CR --> " + msg, roomId);

  clientRooms.get(roomId).forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  })

  // wss.clients.forEach((client) => {
  //   const clientRoom = clientRooms.get(client);
  // console.log("CR --> " + clientRoom, roomId);

  //   if (clientRoom === roomId && client.readyState === WebSocket.OPEN) {
  //     client.send(msg);
  //   }
  // });
}


















server.listen(4500, () => {
  console.log('Server is running on port 4500');
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
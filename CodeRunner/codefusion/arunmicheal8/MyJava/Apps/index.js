

const express = require('express');
const http = require('http');


const app = express();
const server = http.createServer(app);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(3000, () => console.log("Connected PORT:", 3000))
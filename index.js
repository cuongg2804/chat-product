const express = require('express');
const app = express();
const http = require('http');

const { Server } = require("socket.io");


app.use(express.static(`${__dirname}/public`));

const routersClient = require("./router/client/index.router");

routersClient(app);

//Socket
const server = http.createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
})
//EndSocket


app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

server.listen(5000, () => {
    console.log('listening on : 5000');
})
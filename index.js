const express = require('express');
const app = express();
const http = require('http');
const database = require("./config/database")
var bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require("method-override");
const dotenv = require("dotenv");
const flash = require('express-flash');
const { Server } = require("socket.io");


dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/public`));

const routersClient = require("./router/client/index.router");



//Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 1000000 }}));
app.use(flash());
//End Flash


//Socket
const server = http.createServer(app);
const io = new Server(server);
global._io = io ;
//EndSocket

//Database
database.connect();
//End database


app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);
app.use(methodOverride('_method'));

routersClient(app);

server.listen(5000, () => {
    console.log('listening on : 5000');
})

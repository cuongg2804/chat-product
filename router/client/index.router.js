const homeChat = require("./chat.router");
const userRouter = require("./user.router");
const authMiddlewares = require("../../middlewares/auth.middlewares");
const usersRouter = require("./users.router");
const roomChat = require ("./room-chat.router");
//const chatMiddlewares = require("../../middlewares/chat.middlewares");

module.exports = (app) =>{
    app.use("/", homeChat);

    app.use("/user", userRouter);

    app.use("/users", authMiddlewares.requireAuth, usersRouter);
    
    app.use("/rooms-chat", authMiddlewares.requireAuth,roomChat);
}
const homeChat = require("./chat.router");

module.exports = (app) =>{
    app.use("/", homeChat);
}
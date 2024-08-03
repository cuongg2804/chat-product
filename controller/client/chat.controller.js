module.exports.index = (req , res) => {
    res.render("pages/chat.pug",{
        pageTitle : "Chat"
    });
}
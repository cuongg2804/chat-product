module.exports.index = async (req , res) => {
    res.render("pages/chat.pug",{
        pageTitle : "Chat",
    });
}
const Chat = require("../../models/chat.model");
const chatSocket = require("../../socket.io/client/chat.socket");
const User = require("../../models/user.model");
module.exports.index = async (req , res) => {
    

    const chats  = await Chat.find({
        room_chat_id: req.params.idRoomChat,
        deleted : false
    })

    for(chat of chats ){
        const inforUser = await User.findOne({
            _id : chat.user_id
        })
         chat.userFullname = inforUser.fullName

    }
    chatSocket(req,res);
    res.render("pages/chat.pug",{
        pageTitle : "Chat",
        chats : chats
    });
}
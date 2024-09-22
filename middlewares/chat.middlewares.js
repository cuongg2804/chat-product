const RoomChat = require("../models/room-chat.model");

module.exports.Access = async (req, res ,next) => {
    const idRoomChat = req.params.idRoomChat;
    const idUser = req.cookies.idUser;

    const userInRoom = await RoomChat.findOne({
        _id : idRoomChat,
         "user.user_id" : idUser,
        deleted : false
    })
    console.log(userInRoom);
    if(!userInRoom){
        
        return;
    }
    next();
}
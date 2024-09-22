const uploadToCloudinarys = require("../../helper/uploadToCloudinary.helper");
const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports = async (req, res) => {
    const userID = res.locals.user.id;
    const userFullname = res.locals.user.fullName;
    const idRoomChat = req.params.idRoomChat;
    //Khai báo Socket.io
        _io.once('connection', (socket) => {
            socket.join(idRoomChat);
            console.log(`${userFullname} đã kết nối`);

            socket.on('disconnect', () => {
            console.log(`${userFullname} đăng xuất`);
            });

            socket.on("CLIENT_SEND_MESSAGE", async (data) => {
                const images = [];
                if(data.images.length > 0) {
                    for (const image of data.images) {
                        
                        const linkImage = await uploadToCloudinarys(image);
                        images.push(linkImage);
                    }
                }
               

                const chat = new Chat({
                    user_id: userID,
                    room_chat_id: req.params.idRoomChat,
                    content: data.content,
                    images: images
                 })
               
                //Lưu tin nhắn vào Database
                await chat.save();
                //Real time
                _io.to(idRoomChat).emit("SERVER_RETURN_DATA",{
                    userID:  userID,
                    content : data.content,
                    images: images,
                    userFullname : userFullname
                })
                
            })

            socket.on("SERVER_SEND_TYPING", (type) => {
                socket.broadcast.to(idRoomChat).emit("SERVER_RETURN_TYPING",{
                    type: type,
                    userID : userID,
                    fullName :userFullname
                })
            })

        })

       
        
    //End Khai báo
}
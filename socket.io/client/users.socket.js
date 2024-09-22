const User = require("../../models/user.model");
const Room_Chat = require("../../models/room-chat.model");


module.exports = (req, res) => {
    const userIdA = res.locals.user.id ;
  
    _io.once('connection', (socket) => {
       
        //Khi A gửi yêu cầu kết bạn cho B
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            const existAinB = await User.findOne({
                _id :userIdB,
                acceptFriends : userIdA
            })

            // Lưu A vào danh sách Lời mời kết bạn của B 
            if(!existAinB){
                await User.updateOne({
                    _id : userIdB
                },{
                    $push: {acceptFriends : userIdA}
                })
            }

            // Lưu B vào danh sách Lời mời đã gửi của A
            const existBinA = await User.findOne({
                _id : userIdA,
                requestFriends : userIdB
            })
            if(!existBinA){
                await User.updateOne({
                    _id : userIdA
                },{
                    $push : {requestFriends : userIdB}
                });
            }

            const inforUserB = await User.findOne({
                _id : userIdB
            })
            const length_accept_Friends = inforUserB.acceptFriends.length ;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userIdB,
                lengthAcceptFriends: length_accept_Friends
            }  );

            //Thêm thông tin của B vào danh sách kết bạn của A
            const inforUserA = await User.findOne({
                _id : userIdA
            }).select("id fullName avatar");
            socket.broadcast.emit("SERVER_RETURN_INFOR_ACCEPT_FRIEND",({
                userIdB :userIdB,
                inforUserA :inforUserA
            }))
            //Hết thêm thông tin của B vào danh sách kết bạn của A
            
        })
        //Hết khi A gửi yêu cầu kết bạn cho B

        //Khi A hủy Lời mời kết bạn với B
        socket.on("CLIENT_CANCEL_FRIREND", async (userIdB) => {
           
            // Xoá id của B trong A
            await User.updateOne({
                _id :  userIdA
            },{
                $pull : {requestFriends : userIdB}
            })

            //Xoá id của A trong B

            await User.updateOne({
                _id : userIdB
            },{
                $pull : {acceptFriends :userIdA }
            })

            const inforUserB = await User.findOne({
                _id : userIdB
            })
            const length_accept_Friends = inforUserB.acceptFriends.length ;
            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND",{
                userId: userIdB,
                lengthAcceptFriends: length_accept_Friends
            }  );


            const inforUserA = await User.findOne({
                _id : userIdA
            }).select("id fullName avatar");
            socket.broadcast.emit("SEVER_RETURN_CANCEL_FRIEND",({
                userIdB :userIdB,
                userIdA :userIdA
            }))
        })

        //Hết khi A hủy Lời mời kết bạn với B
        socket.on("CLIENT_REFUSE_FRIREND", async (userIdB) =>{
            
            
            // Xoá id của B trong A
            await User.updateOne({
                _id :  userIdA
            },{
                $pull : {acceptFriends : userIdB}
            })

            //Xoá id của A trong B

            await User.updateOne({
                _id : userIdB
            },{
                $pull : {requestFriends :userIdA }
            })
            
        })

       
        //Khi A ấn nút không đồng ý kết ban

        
        //Hết khi A đồng ý kết bạn với B
        socket.on("CLIENT_ACCEPT_FRIREND", async (userIdB) =>{
            const inforB = await User.findOne({
                _id : userIdB
            })
            //Tạo phòng chat mới
            const Room = new Room_Chat({
                title: inforB.fullName,
                typeRoom: "friend",
                users: [
                  {
                    user_id: userIdA,
                    role: "superAdmin"
                  },
                  {
                    user_id: userIdB,
                    role: "superAdmin"
                  }
                ],
            })

            await Room.save();
            //Hết tạo phòng chat mới

            // Thêm {user_id, room_chat_id} của B vào friendsList của A
            // Xóa id của B trong acceptFriends của A
            await User.updateOne({
                _id : userIdA
            },{
                $push : 
                {
                    friendsList : {
                        user_id: userIdB,
                        room_chat_id: Room.id
                    }
                },
            
                $pull : {acceptFriends : userIdB}
            })
            

            // Thêm {user_id, room_chat_id} của A vào friendsList của B
            // Xóa id của A trong requestFriends của B
            await User.updateOne({
                _id : userIdB 
            },{
                $push : 
                {
                    friendsList : {
                        user_id: userIdA,
                        room_chat_id: Room.id
                    }
                }
            ,
                $pull : {requestFriends :userIdA }
            })
        })
         //Khi A ấn nút đồng ý kết ban
    })
}
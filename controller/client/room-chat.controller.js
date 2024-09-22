const User = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

module.exports.index = async (req , res) => {
    const RoomList = res.locals.user.friendsList;
    for(Room of RoomList){
        const dataRoom = await RoomChat.findOne({
            _id : Room.room_chat_id,
            deleted : false
        }).select("title avatar");
        console.log(dataRoom);
        Room.dataRoom = dataRoom;
    }
    console.log(RoomList)
    res.render("pages/room-chat/index.pug",{
        pageTitle : "Phòng chat",
        Rooms : RoomList
    });
}

module.exports.Create = async(req , res) => {
    const friendsList = res.locals.user.friendsList;
    for(friend of friendsList){
        const infoFriend = await User.findOne({
            _id: friend.user_id
          }).select("fullName avatar");
          friend.infoFriend = infoFriend;
    }
   
    res.render("pages/room-chat/create.pug",{
        pageTitle : "Tạo phòng chat",
        friendsList : friendsList
    });
}

module.exports.CreatePost = async(req , res) => {
    console.log(req.body);
    const newDataRoom = {
        title : req.body.title,
        typeRoom : "group",
        users : []
    }
    req.body.usersId.forEach(user => {
        const newUser = {
            id : user,
            role : "member"
        }
        newDataRoom.users.push(newUser);
    })
    newDataRoom.users.push({
        id : res.locals.user.id,
        role : "superAdmin"
    })


    const newRoom = await RoomChat(newDataRoom);
     await newRoom.save();

     res.redirect(`/rooms-chat/${newRoom.id}`);
}
const Account = require("../../models/accounts.model");
const User = require("../../models/user.model");
const userSocket = require("../../socket.io/client/users.socket");

module.exports.notFriend = async (req, res) => {
    const userID = res.locals.user.id;
    const requestFriends = res.locals.user.requestFriends;
    const acceptFriend = res.locals.user.acceptFriends ;
    const listFriends = res.locals.user.friendsList.map(user => user.user_id) ;

    const listAccount = await User.find({
        $and:[
            {
                _id : { $ne :userID}
            },
            {
                _id : { $nin : requestFriends}
            },
            {
                _id : { $nin : acceptFriend}
            },
            {
                _id : {  $nin : listFriends }
            }
        ]
        ,
        deleted: false
    }).select("avatar fullName");
    userSocket(req, res);

    res.render("pages/users/not-friend.pug",{
        pageTitle : "Bạn mới",
        User : listAccount
    })
}

module.exports.requestFriend = async (req , res) => {
    
    const listInfoUser = await User.find({
        _id :res.locals.user.requestFriends,
        deleted : false 
    })
    userSocket(req, res);
    res.render("pages/users/request.pug",{
        pageTitle : "Danh sách lời mời đã gửi",
        User : listInfoUser 
    })
}

module.exports.acceptFriend = async (req , res) => {
    const listAccept = res.locals.user.acceptFriends;
    const infoListAccept = await User.find({
        _id : {$in : listAccept},
        deleted : false
    }).select("avatar fullName");
    userSocket(req, res);
    res.render("pages/users/accept.pug",{
        pageTitle : "Lời mời kết bạn",
        User : infoListAccept
    })
}

module.exports.Friend = async (req , res) => {
    const IDfriendList = res.locals.user.friendsList.map(user => user.user_id);

    const friendList = await User.find({
        _id : {$in : IDfriendList},
        status : "active",
        deleted : false
    }).select("avatar fullName statusOnline");
    userSocket(req, res);
    friendList.forEach(friend => {
        const info = res.locals.user.friendsList.find(userFriend => friend.id  == userFriend.user_id);
        friend.room_chat_id = info.room_chat_id;
    })
    res.render("pages/users/friendList.pug",{
        pageTitle : "Danh sách bạn bè",
        friendList : friendList
    })

}


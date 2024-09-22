const User = require("../../models/user.model");
const md5 = require('md5');

module.exports.login = async (req, res) => {
    res.render("pages/users/login.pug",{
        pageTitle : "Đăng nhập"
    })
}

module.exports.loginPost = async (req, res) => {
   const email = req.body.email;
   const password = md5(req.body.password);

   const user = await User.findOne({
        email : email,
        deleted : false
   })

   if(!user){
        req.flash('error',"Email không tồn tại!");
        res.redirect("back");
        return;
   }

   if(password != user.password){
        req.flash('error',"Sai mật khẩu!");
        res.redirect("back");
        return;
   }
   await User.updateOne({
        _id :  user.id
   },{
    statusOnline : "online"
   })

   _io.once('connection',(socket) => {
        socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE",{
            idUser :user.id,
            statusOnline :"online"
        })
   })

   res.cookie('idUser', user.id);
   req.flash('success',`Xin chào! ${user.fullName}`);
   res.redirect("/rooms-chat");
   
}

module.exports.register = async (req, res) => {
    res.render("pages/users/register.pug",{
        pageTitle : "Đăng ký tài khoản"
    })
}

module.exports.registerPost = async (req, res) => {
    req.flash('error', 'Sai mật khẩu!');
    res.redirect('back');
}

module.exports.logout = async (req, res) => {
    await User.updateOne({
        _id :  req.cookies.idUser
   },{
    statusOnline : "offline"
   })

   _io.once('connection', (socket) => {
    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
        idUser: req.cookies.idUser,
        statusOnline: "offline"
    })
  })
    res.clearCookie("idUser");
    res.redirect("back");
}


const User = require("../models/user.model");

module.exports.requireAuth = async (req , res , next ) =>{
    if(!req.cookies.idUser){
        res.redirect("/user/login");
        return;
    }

    const user = await User.findOne({
        _id : req.cookies.idUser,
        deleted : false
    })

    if(!user){
        res.redirect("/user/login");
        return;
    }

    res.locals.user = user;
    next();
}
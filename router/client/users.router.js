const usersController = require("../../controller/client/users.controller");
const express = require("express") ;
const router = express.Router() ;

router.get("/not-friend", usersController.notFriend);

router.get("/request", usersController.requestFriend);

router.get("/accept", usersController.acceptFriend);

router.get("/friends", usersController.Friend);

module.exports = router ;

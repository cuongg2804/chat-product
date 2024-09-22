const express = require("express") ;
const router = express.Router() ;
const room_chatController = require("../../controller/client/room-chat.controller");
const chatController = require("../../controller/client/chat.controller");
const authMiddlewares = require("../../middlewares/auth.middlewares");
const accessMiddlewares = require("../../middlewares/chat.middlewares");

router.get("/", room_chatController.index );





// GET /rooms-chat/create

router.get("/create", room_chatController.Create );

// POST /rooms-chat/create

router.post("/create", room_chatController.CreatePost );

router.get("/:idRoomChat", authMiddlewares.requireAuth,chatController.index );

module.exports = router ;



const express = require("express") ;
const router = express.Router() ;
const firstController  = require("../../controller/client/first.controller");


router.get("/", firstController.index );

module.exports = router ;



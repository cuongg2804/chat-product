const express = require("express") ;
const router = express.Router() ;
const loginController = require("../../controller/client/user.controller");

router.get("/login",  loginController.login );

// POST /login

router.post("/login",  loginController.loginPost );


// GET /user/register

router.get("/register",  loginController.register );

// POST /user/register

router.post("/register",  loginController.registerPost );

// GET /user/logout

router.get("/logout",  loginController.logout );



module.exports = router ;



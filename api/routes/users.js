const express = require("express");
let router = express.Router()


/* CONTROLLERS */
const usersController = require("../controllers/users");


router.use(function (req, res, next) {
    console.log(req.url, "@", Date.now());
    next()
})


// Usuarios
router.get("/get", usersController.GET);




module.exports = router;
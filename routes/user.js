const express = require("express");
const { check, body } = require("express-validator");

const userController = require("../controller/user");

const router = express.Router();

//add user here
router.post(
  "/add-user",
  check("email").isEmail(),
  body("password").isLength({ min: 4 }),
  userController.postAddUser
);
router.post("/user-login", check("email").isEmail(), userController.userLogIn);
router.get("/user-products", userController.getUserProducts);
module.exports = router;
//check returns a middleware
//checking password in the body, ignoring any password in the header etc

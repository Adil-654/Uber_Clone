const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require('../middleware/auth.middleware');  // Ensure it's a function

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  userController.registerUser  // Ensure this is a function
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  userController.loginUser  // Ensure this is a function
);

// Profile route - Ensure authMiddleware is a function
router.get('/profile', authMiddleware, userController.getUserProfile);
router.get('/logout',authMiddleware,userController.logoutUser)

module.exports = router;

const express = require("express");
const router = express.Router();
const captainController = require("../controllers/captain.controller");
const mongoose=require('mongoose')
const {body}=require('express-validator')


router.post('/register',[
    body("email").isEmail().withMessage("Invalid Email"),
    body('fullname.firstname')
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
      body('vehicle.color').isLength({min:3})
      .withMessage("Color  must be at least 3 characters"),
      body('vehicle.plate').isLength({min:3})
      .withMessage("plate  must be at least 3 characters"),
      body('vehicle.capacity').isLength({min:1})
      .withMessage("capacity  must be at least 1"),
      body('vehicle.vehicleType').isLength({min:3})
      .isIn(['car','auto','motorcycle']).withMessage('Invalid Vehicle')
],
captainController.registerCaptain 
)

module.exports = router;

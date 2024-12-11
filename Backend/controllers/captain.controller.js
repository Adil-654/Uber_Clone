const captainModel=require('../models/captain.model')
const   captainService=require('../services/captain.service')
const { validationResult } = require("express-validator");


module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullname, email, password,vehicle } = req.body;

    const isCaptainAlreadyExist=await captainModel.findOne({email})
    if(isCaptainAlreadyExist){
        return res.status(400).json({ message:"Captain Already exist " });

    }
    const hashed_password = await captainModel.hashPassword(password);
    const captain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashed_password,
      color:vehicle.color,
      plate:vehicle.plate,
      capacity:vehicle.capacity,
      vehicleType:vehicle.vehicleType
    });
    const token = captain.generateAuthToken();
    captain.save();
    res.status(201).json({ token, captain });
  };
  
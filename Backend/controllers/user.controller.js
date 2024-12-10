const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;
  const hashed_password = await userModel.hashPassword(password);
  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashed_password,
  });
  const token = user.generateAuthToken();
  user.save();
  res.status(201).json({ token, user });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid Email or Password" });
  }
  const token = user.generateAuthToken();
  console.log("User Logged In Successfully");
  res.status(200).json({ user, token });
};

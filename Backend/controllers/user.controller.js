const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const userBlackListedTokenModel = require("../models/user.BlackListedToken.model");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res.status(400).json({ message: "User Already exists" });
    }

    const hashed_password = await userModel.hashPassword(password);
    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashed_password,
    });

    const token = user.generateAuthToken();
    await user.save();

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};


module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.sendStatus(401).json({ message: "Invalid Email or Password" });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.sendStatus(401).json({ message: "Invalid Email or Password" });
  }
  const token = user.generateAuthToken();
  console.log("User Logged In Successfully");
  res.cookie("token", token);
  res.sendStatus(200).json({ user, token });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.sendStatus(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await userBlackListedTokenModel.create({ token });
  res.sendStatus(200).json({ message: "Logged Out" });
};

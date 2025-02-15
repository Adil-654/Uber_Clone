const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      require: true,
      minlength: [3, "First name must atleast 3 char"],
    },
    lastname: {
      type: String,

      minlength: [3, "First name must atleast 3 char"],
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    minlength: [5, "Email must atleast 3 char"],
  },

  password: {
    type: String,
    require: true,
    select: false,
    minlength: [3, "First name must atleast 3 char"],
  },
  socketId: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET,{expiresIn:'24h'});
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;

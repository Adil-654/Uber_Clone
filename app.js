const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser=require('cookie-parser')
const cors = require("cors");
const connectDb = require("./db/db");
const app = express();
const userRoutes = require("./routes/user.routes");
const captainRoutes=require('./routes/captain.routes')
connectDb();

app.use(cors());
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/user", userRoutes);
app.use("/captain", captainRoutes);
module.exports = app;


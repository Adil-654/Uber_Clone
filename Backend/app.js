const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./db/db");
const app = express();
const userRoutes = require("./routes/user.routes");
connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/user", userRoutes);
module.exports = app;

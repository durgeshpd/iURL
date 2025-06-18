const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const urlRoutes = require("./routes/url");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use("/url", urlRoutes);
app.use("/user", userRoutes);

module.exports = app;
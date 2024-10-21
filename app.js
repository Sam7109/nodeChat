const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const PORT = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const sequelize = require("./utils/seq");

const path = require("path");
const app = express();

const Userdetails = require("./model/userdetails");

// Middleware
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded payloads

app.use(express.static(path.join(__dirname, "views")));

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

sequelize
  .sync() //{alter:true} force: true will drop existing tables { alter:true} will match with model definitions

  .then(() => {
    console.log("Database synchronized");
    // Start the server

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing the database:", err);
  });

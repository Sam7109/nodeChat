const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const PORT = process.env.PORT || 3000;

const bodyParser = require("body-parser");
const sequelize = require("./utils/seq");

const path = require("path");
const app = express();

const Userdetails = require("./model/userdetails");
const Messages = require("./model/messages");

const Group = require("./model/groups");
const GroupMember = require("./model/groupmembers");
const GroupMessage = require("./model/groupmessage");

const signupRoutes = require("./routes/signup");
const textroutes = require("./routes/messages");

// Userdetails has many Messages
Userdetails.hasMany(Messages, { foreignKey: "userId", as: "messages" });
Messages.belongsTo(Userdetails, { foreignKey: "userId", as: "user" });

// Group has many Messages
Group.hasMany(Messages, { foreignKey: "groupId", as: "messages" });
Messages.belongsTo(Group, { foreignKey: "groupId", as: "group" });

// Group has many GroupMembers
Group.hasMany(GroupMember, { foreignKey: "groupId", as: "members" });
GroupMember.belongsTo(Group, { foreignKey: "groupId", as: "group" });

// Userdetails has many GroupMember (user's membership in groups)
Userdetails.hasMany(GroupMember, { foreignKey: "userid", as: "groupMemberships" });
GroupMember.belongsTo(Userdetails, { foreignKey: "userid", as: "user" });

// Group has many GroupMessages
Group.hasMany(GroupMessage, { foreignKey: "groupId", as: "groupMessages" });
GroupMessage.belongsTo(Group, { foreignKey: "groupId", as: "group" });

// Userdetails has many GroupMessages (user's messages in groups)
Userdetails.hasMany(GroupMessage, { foreignKey: "userid", as: "userMessages" });
GroupMessage.belongsTo(Userdetails, { foreignKey: "userid", as: "user" });

// Middleware
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded payloads

app.use(express.static(path.join(__dirname, "views")));
app.use("/api", signupRoutes);

app.use("/textroutes", textroutes);

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/homepage", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "homepage.html"));
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



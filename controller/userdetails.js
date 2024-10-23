const Userdetails = require("../model/userdetails");
const bcrypt = require("bcryptjs"); // bcrypt to compare passwords
const { config } = require("dotenv");

const jwt = require("jsonwebtoken"); // for token generation
require('dotenv').config();


exports.postUserdetails = async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;

    const existingUser = await Userdetails.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const userDetails = await Userdetails.create({
      username: username,
      email: email,
      password: password,
      mobile: mobile,
    });

    return res
      .status(201)
      .json({ message: "User registered Successfully", data: userDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.isValidUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Userdetails.findOne({ where: { email } });
    if (!user) {
      res.status(500).json({ message: "User does not exist" });
    }

    const userPass = bcrypt.compare(password, user.password);
    if (!userPass) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN } // Token expiration time
      );

      return res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

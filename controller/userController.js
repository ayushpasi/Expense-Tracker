const UserModel = require("../models/userModel");
const path = require("path");

const getLoginPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
  } catch (error) {
    console.log(error);
  }
};

const postUserSignUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Some data is missing" });
  }

  try {
    const existingUser = await UserModel.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(409).json({
        error: "This email is already taken. Please choose another one.",
      });
    }

    // Only create a new user if all required data is present and the email doesn't exist
    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    res.status(200).json({ message: "Registered successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const postUserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ where: { email: email } });
    if (existingUser) {
      console.log(existingUser);
      if (existingUser.password === password) {
        res.send(`alert("login succesfully")`);
      } else {
        res.status(401).json({ errr: "User not authorized" });
      }
    } else {
      res.status(404).json({ error: "User Not Found" });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = { postUserSignUp, getLoginPage, postUserLogin };

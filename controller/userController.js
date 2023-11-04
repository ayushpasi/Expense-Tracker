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

  try {
    const existingUser = await UserModel.findOne({ where: { email: email } });

    if (existingUser) {
      return res.status(409).send({ conflict: "Email already exists" });
    }

    // Only create a new user if the email doesn't exist
    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    res
      .status(200)
      .send({ success: "Successfully created user", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = { postUserSignUp, getLoginPage };

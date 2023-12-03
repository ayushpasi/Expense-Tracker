const path = require("path");
const UserModel = require("../models/userModel");
const Sib = require("sib-api-v3-sdk");

const forgotPasswordPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../", "public", "views", "forgotPassword.html")
  );
};

const sendMail = async (req, res) => {
  try {
    const { email } = req.body;
    const recepientEmail = UserModel.findOne({ where: { email: email } });

    if (!recepientEmail) {
      return res
        .status(404)
        .json({ message: "Please provide the registered email!" });
    }
    const client = Sib.ApiClient.instance;

    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.API_KEY;

    const sender = {
      email: "ayushpasi8839@gmail.com",
      name: "SmartSpend",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    const transactionalEmailApi = new Sib.TransactionalEmailsApi();

    const emailResponse = await transactionalEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Reset Password for Your Account",
      htmlContent: `
        <p>Hello,</p>
        <p>Please follow the link to reset your password.</p>
        <p><a href="http://localhost:3000/password/resetPasswordPage">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
    return res.status(200).json({
      message:
        "Link for reset the password is successfully send on your Mail Id!",
    });
  } catch (error) {
    console.log(error);
    return res.status(409).json({ message: "failed changing password" });
  }
};
module.exports = { forgotPasswordPage, sendMail };

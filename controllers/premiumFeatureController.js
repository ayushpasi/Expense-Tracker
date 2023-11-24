const userModel = require("../models/userModel");
const expenseModel = require("../models/expenseModel");

const getUserLeaderBoard = async (req, res) => {
  try {
    const users = await userModel.findAll();
    const expenses = await expenseModel.findAll();
    const userAgreegatedExpens = {};
    expenses.forEach((expense) => {
      if (userAgreegatedExpens[expense.userId]) {
        userAgreegatedExpens[expense.userId] += expense.expenseAmount;
      } else {
        userAgreegatedExpens[expense.userId] = expense.expenseAmount;
      }
    });
    const userLeaderboardDetails = [];
    users.forEach((user) => {
      userLeaderboardDetails.push({
        name: user.name,
        total_cost: userAgreegatedExpens[user.id],
      });
    });

    userLeaderboardDetails.sort((a, b) => b.total_cost - a.total_cost);
    res.status(200).json({ userLeaderboardDetails });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports = { getUserLeaderBoard };

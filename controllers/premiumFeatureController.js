const userModel = require("../models/userModel");
const expenseModel = require("../models/expenseModel");
const sequelize = require("sequelize");
const getUserLeaderBoard = async (req, res) => {
  try {
    const userLeaderboardDetails = await userModel.findAll({
      attributes: [
        "name",
        [
          sequelize.fn("sum", sequelize.col("expenses.expenseAmount")),
          "total_cost",
        ],
      ],
      include: [
        {
          model: expenseModel,
          attributes: [],
        },
      ],
      group: ["users.id"],
      order: [[sequelize.literal("total_cost"), "DESC"]],
    });
    console.log(userLeaderboardDetails);
    res.status(200).json({ userLeaderboardDetails });
    //Brute force approach
    // const users = await userModel.findAll();
    // const expenses = await expenseModel.findAll();
    // const userAgreegatedExpens = {};
    // expenses.forEach((expense) => {
    //   if (userAgreegatedExpens[expense.userId]) {
    //     userAgreegatedExpens[expense.userId] += expense.expenseAmount;
    //   } else {
    //     userAgreegatedExpens[expense.userId] = expense.expenseAmount;
    //   }
    // });
    // const userLeaderboardDetails = [];
    // users.forEach((user) => {
    //   userLeaderboardDetails.push({
    //     name: user.name,
    //     total_cost: userAgreegatedExpens[user.id]||0,
    //   });
    // });

    // userLeaderboardDetails.sort((a, b) => b.total_cost - a.total_cost);
    // res.status(200).json({ userLeaderboardDetails });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

module.exports = { getUserLeaderBoard };

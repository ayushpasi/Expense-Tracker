const { where } = require("sequelize");
const ExpenseModel = require("../models/expenseModel");

//save data to database

const addExpense = async (req, res, next) => {
  try {
    const expenseAmount = req.body.expenseAmount;
    const expenseDescription = req.body.expenseDescription;
    const expenseCategory = req.body.expenseCategory;

    const data = await ExpenseModel.create({
      expenseAmount: expenseAmount,
      expenseDescription: expenseDescription,
      expenseCategory: expenseCategory,
      userId: req.user.id,
    });

    res.status(201).json({ expense: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to create a new expense",
      message: error.message,
    });
  }
};
//fetch all expenses
const getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await ExpenseModel.findAll({
      where: { userId: req.user.id },
    });
    res.status(200).json(expenses);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err: err,
    });
  }
};

//delete user
const deleteExpense = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log("hello");
    console.log(userId);
    if (!userId) {
      return res.status(400).json({
        error: "Id missing",
      });
    }

    const result = await ExpenseModel.destroy({
      where: {
        id: userId,
      },
    });

    if (result === 1) {
      return res.status(200).json({
        success: "User deleted successfully",
      });
    } else {
      return res.status(404).json({
        error: "User not found", // Notify if the user with the given ID was not found
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Error in deleting",
    });
  }
};

module.exports = { addExpense, getAllExpenses, deleteExpense };

const ExpenseModel = require("../models/expenseModel");
const UserModel = require("../models/userModel");
const sequelize = require("../util/database");
//save data to database
const addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const expenseAmount = req.body.expenseAmount;
    const expenseDescription = req.body.expenseDescription;
    const expenseCategory = req.body.expenseCategory;

    const data = await ExpenseModel.create(
      {
        expenseAmount: expenseAmount,
        expenseDescription: expenseDescription,
        expenseCategory: expenseCategory,
        userId: req.user.id,
      },
      { transaction: t }
    );

    const newTotalExpense =
      parseInt(req.user.totalExpense) + parseInt(expenseAmount);

    await UserModel.update(
      {
        totalExpense: newTotalExpense,
      },
      {
        where: { id: req.user.id },
        transaction: t, // Pass the transaction object here
      }
    );

    await t.commit();
    res.status(201).json({ expense: data });
  } catch (error) {
    await t.rollback();
    console.error(error);
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
  const t = await sequelize.transaction();
  try {
    const expenseId = req.params.id; // Use expenseId instead of userId
    console.log(expenseId);
    if (!expenseId) {
      return res.status(400).json({
        error: "Expense ID missing",
      });
    }

    // Check if the expense exists for the given ID
    const expense = await ExpenseModel.findOne({
      where: {
        id: expenseId,
      },
      transaction: t,
    });

    if (!expense) {
      await t.rollback();
      return res.status(404).json({
        error: "Expense not found",
      });
    }

    // Delete the expense
    const deleteResult = await ExpenseModel.destroy({
      where: {
        id: expenseId,
      },
      transaction: t,
    });

    // Update total expense of the user
    const newTotalExpense = req.user.totalExpense - expense.expenseAmount;
    await req.user.update(
      { totalExpense: newTotalExpense },
      { transaction: t }
    );

    await t.commit();

    if (deleteResult === 1) {
      return res.status(200).json({
        success: "Expense deleted successfully",
      });
    } else {
      return res.status(404).json({
        error: "Expense not found",
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      error: "Error in deleting expense",
    });
  }
};

module.exports = { addExpense, getAllExpenses, deleteExpense };

const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");

router.get("/getAllExpenses", expenseController.getAllExpenses);

router.get("/deleteExpense/:id", expenseController.deleteExpense);

router.post("/addExpense", expenseController.addExpense);

module.exports = router;
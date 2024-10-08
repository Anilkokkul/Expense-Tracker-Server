const express = require("express");
const {
  lockIncome,
  addIncome,
  getAllIncomes,
} = require("./controllers/income.controller");
const {
  addExpense,
  editExpense,
  deleteExpense,
  getAllExpenses,
  getExpenseByMonth,
} = require("./controllers/expense.controller");
const {
  signUpUser,
  loginUser,
  addCategory,
  getCategories,
  logoutUser,
} = require("./controllers/user.controller");
const { authorization } = require("./utils/authenticator");

const router = express.Router();

//auth routes
router.post("/sign-up", signUpUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/add-category", authorization, addCategory);
router.get("/category", authorization, getCategories);

//income routes
router.post("/income/add", authorization, addIncome);
router.patch("/income/lock", authorization, lockIncome);
router.get("/income", authorization, getAllIncomes);

//Expense routes
router.post("/expense/add", authorization, addExpense);
router.put("/expense/:id", authorization, editExpense);
router.delete("/expense/:id", authorization, deleteExpense);
router.get("/expense", authorization, getAllExpenses);

module.exports = router;

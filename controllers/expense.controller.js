const Expense = require("../model/expense.model");
const Income = require("../model/income.model");

exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const userId = req.userId;
    const expenseDate = new Date(date);
    const month = expenseDate.toISOString().slice(0, 7);
    const expense = new Expense({
      userId,
      title,
      amount,
      category,
      date: expenseDate,
      month,
    });

    const updatedIncome = await Income.findOneAndUpdate(
      { month, userId },
      {
        $inc: { remainingIncome: -amount },
      },
      {
        new: true,
      }
    );
    if (!updatedIncome) {
      return res.status(404).send({
        message: "Income record not found",
      });
    }
    await expense.save();
    return res.status(200).send({
      message: "Expense added successfully",
      data: updatedIncome,
      expense,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.editExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, amount, category, date } = req.body;
    const expenseDate = new Date(date);
    const month = expenseDate.toISOString().slice(0, 7);
    const oldExpense = await Expense.findById(id);
    const amountDifference = oldExpense.amount - amount;
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      {
        title,
        amount,
        category,
        expenseDate,
        month,
      },
      {
        new: true,
      }
    );
    if (!updatedExpense) {
      return res.status(404).send({
        message: "Expense record not found",
      });
    }

    await Income.findOneAndUpdate(
      { month, userId },
      {
        $inc: {
          totalIncome: amountDifference,
          remainingIncome: amountDifference,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id)
      .then((data) => {
        return res
          .status(200)
          .send({ message: "Expense deleted successfully", data: data });
      })
      .catch((err) => {
        return res
          .status(500)
          .send({ message: "Error deleting expense", error: err.message });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const expense = await Expense.find({ userId: userId }).sort({ month: 1 });
    res
      .status(200)
      .send({ message: "Expenses retrieved successfully", data: expense });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

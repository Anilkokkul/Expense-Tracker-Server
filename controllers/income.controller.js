const Income = require("../model/income.model");

exports.addIncome = async (req, res) => {
  try {
    const { amount, month } = req.body;
    const userId = req.userId;
    const existingIncome = await Income.findOne({ userId, month });
    if (existingIncome && existingIncome.isLocked) {
      return res
        .status(400)
        .send({ message: "Income for this month is already locked" });
    }
    if (existingIncome) {
      existingIncome.totalIncome += amount;
      existingIncome.remainingIncome += amount;
      await existingIncome
        .save()
        .then((data) => {
          res.status(200).send({
            message: "Income updated successfully",
            data,
          });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Error updating income", error: err.message });
        });
    } else {
      const newIncome = new Income({
        userId,
        totalIncome: amount,
        remainingIncome: amount,
        month,
      });
      await newIncome
        .save()
        .then((data) => {
          res.status(200).send({
            message: "Income added successfully",
            data: data,
          });
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: "Error adding income", error: err.message });
        });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.lockIncome = async (req, res) => {
  try {
    const userId = req.userId;
    const { month } = req.body;
    const incomeExist = await Income.findOne({ userId, month });
    if (!incomeExist) {
      return res.status(404).send({ message: "Income not found" });
    }
    if (incomeExist.isLocked) {
      return res
        .status(400)
        .send({ message: "Income for this month is already locked" });
    }
    incomeExist.isLocked = true;
    await incomeExist
      .save()
      .then((data) => {
        res
          .status(200)
          .send({ message: "Income locked successfully", data: data });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Error locking income", error: err.message });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getAllIncomes = async (req, res) => {
  try {
    const userId = req.userId;
    const incomes = await Income.find({ userId }).sort({ month: 1 });
    res
      .status(200)
      .send({ message: "Incomes retrieved successfully", data: incomes });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      error: error.message,
    });
  }
};

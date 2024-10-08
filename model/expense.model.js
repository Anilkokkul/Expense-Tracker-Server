const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "grocery",
      "electronics",
      "food",
      "transport",
      "other",
      "healthcare",
      "utilities",
      "savings",
      "subscriptions",
    ],
  },
  month: {
    type: String,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);

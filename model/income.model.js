const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    month: { type: String, required: true },
    totalIncome: { type: Number, required: true, default: 0 },
    remainingIncome: {
      type: Number,
      required: true,
      default: 0,
    },
    isLocked: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Income", incomeSchema);

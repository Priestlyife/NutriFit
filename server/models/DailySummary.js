const mongoose = require("mongoose");

const dailySummarySchema = new mongoose.Schema({
  userId: String,
  date: String,

  totalCalories: Number,
  goalCalories: Number,
  difference: Number,

  mealsCount: Number
}, { timestamps: true });

module.exports = mongoose.model("DailySummary", dailySummarySchema);
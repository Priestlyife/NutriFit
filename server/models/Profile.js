const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    goal: {
      type: String,
      required: true
    },
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    activityLevel: String,
    allergies: String,
    dietaryPreference: String,
    weeklyTarget: String,
    calculatedCalories: Number,
    onboardingCompleted: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
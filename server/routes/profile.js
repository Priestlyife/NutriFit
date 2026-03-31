const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");

// 🔥 Calorie Calculation
const calculateCalories = (weight, height, age, gender, activityLevel, goal) => {
  let bmr;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    low: 1.2,
    light: 1.375,
    moderate: 1.55,
    high: 1.725,
    athlete: 1.9
  };

  let maintenanceCalories = bmr * activityMultipliers[activityLevel];

  if (goal === "gain") return maintenanceCalories + 300;
  if (goal === "lose") return maintenanceCalories - 300;

  return maintenanceCalories;
};



// ================= CREATE PROFILE =================
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      goal,
      age,
      gender,
      height,
      weight,
      activityLevel,
      allergies,
      dietaryPreference,
      weeklyTarget
    } = req.body;

    const calculatedCalories = calculateCalories(
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal
    );

    const existing = await Profile.findOne({ userId });

    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new Profile({
      userId,
      goal,
      age,
      gender,
      height,
      weight,
      activityLevel,
      allergies,
      dietaryPreference,
      weeklyTarget,
      calculatedCalories,
      onboardingCompleted: true
    });

    await profile.save();

    res.json({ message: "Profile created", profile });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Create error" });
  }
});



// ================= GET PROFILE =================
router.get("/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Fetch error" });
  }
});



// ================= UPDATE PROFILE (🔥 IMPORTANT) =================
router.put("/update/:userId", async (req, res) => {
  try {
    const {
      goal,
      age,
      gender,
      height,
      weight,
      activityLevel,
      allergies,
      dietaryPreference,
      weeklyTarget
    } = req.body;

    const calculatedCalories = calculateCalories(
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal
    );

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      {
        goal,
        age,
        gender,
        height,
        weight,
        activityLevel,
        allergies,
        dietaryPreference,
        weeklyTarget,
        calculatedCalories
      },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update error" });
  }
});

module.exports = router;
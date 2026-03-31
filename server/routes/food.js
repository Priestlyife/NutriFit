const express = require("express");
const multer = require("multer");
const fs = require("fs");
const OpenAI = require("openai");

const Meal = require("../models/Meal");
const Profile = require("../models/Profile");

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const DailySummary = require("../models/DailySummary");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


async function updateDailySummary(userId) {
  const profile = await Profile.findOne({ userId });

  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);

  const todayMeals = await Meal.find({
    userId,
    createdAt: { $gte: startOfDay }
  });

  const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);

  const goal = profile?.calculatedCalories || 2000;

  const today = new Date();
  const dateKey = today.getFullYear() + "-" + 
  String(today.getMonth() + 1).padStart(2, "0") + "-" + 
  String(today.getDate()).padStart(2, "0");

  await DailySummary.findOneAndUpdate(
    { userId, date: dateKey },
    {
      totalCalories,
      goalCalories: goal,
      difference: totalCalories - goal,
      mealsCount: todayMeals.length
    },
    { upsert: true, new: true }
  );
}

// =======================
// 🔥 SCAN FOOD ROUTE
// =======================
router.post("/scan-food", upload.single("image"), async (req, res) => {
  try {

    // 🔥 Read uploaded image
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");

    // 🔥 AI FOOD ANALYSIS
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a nutrition AI. Identify food from images and return structured nutrition data."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Identify the food and estimate nutrition. Return ONLY numbers.

Format:
Food: <name>
Calories: <number>
Protein: <number>
Carbs: <number>
Fat: <number>`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const result = response.choices[0].message.content;
    console.log("AI RAW RESPONSE:", result);

    const lines = result.split("\n");

    // 🔥 SAFE NUMBER PARSER
    const safeNumber = (text) => {
      const num = parseInt(text.replace(/[^\d]/g, ""));
      return isNaN(num) ? 0 : num;
    };

    // 🔥 CREATE MEAL OBJECT (NOT SAVED YET)
    const meal = {
      userId: req.body.userId,
      food: lines[0]?.replace("Food:", "").trim() || "Unknown Food",
      calories: safeNumber(lines[1] || ""),
      protein: safeNumber(lines[2] || ""),
      carbs: safeNumber(lines[3] || ""),
      fat: safeNumber(lines[4] || "")
    };

    // =======================
    // 🔥 INTELLIGENCE LOGIC
    // =======================

    const profile = await Profile.findOne({ userId: req.body.userId });

    let warning = "";
    let portion = 100;
    let diff = 0;

    if (profile) {

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const todayMeals = await Meal.find({
        userId: req.body.userId,
        createdAt: { $gte: startOfDay }
      });

      const totalToday = todayMeals.reduce((sum, m) => sum + m.calories, 0);

      // 🔥 simulate adding new meal
      const totalWithNewMeal = totalToday + meal.calories;

      // 🔥 correct remaining calculation
      diff = Math.round(profile.calculatedCalories - totalWithNewMeal);

      // 🔥 WARNING SYSTEM
      if (diff < 0) {

        portion = Math.max(
          10,
          Math.round((diff + meal.calories) / meal.calories * 100)
        );

        warning = `⚠️ This meal exceeds your daily calories.
👉 Eat only ${portion}% of this meal.
👉 Consider a lighter option like vegetables or lean protein.`;

      } else {

        warning = "✅ This meal fits your calorie goal.";

      }
    }

    // =======================
    // 🔥 FINAL RESPONSE
    // =======================
    const finalResult = `
🍽 Food: ${meal.food}

🔥 Calories: ${meal.calories} kcal
🥩 Protein: ${meal.protein}g
🍞 Carbs: ${meal.carbs}g
🥑 Fat: ${meal.fat}g

📊 ${diff >= 0 
  ? `Remaining Calories: ${diff} kcal` 
  : `Exceeded by: ${Math.abs(diff)} kcal`
}

${warning}
`;

    res.json({
      result: finalResult,
      mealData: meal // ✅ send but DO NOT save yet
    });

  } catch (error) {
    console.error("Scan food error:", error);
    res.status(500).json({
      error: "AI food detection failed"
    });
  }
});


// =======================
// ✅ CONFIRM & SAVE MEAL
// =======================
router.post("/confirm-meal", async (req, res) => {
  try {
    const meal = new Meal(req.body);

    await meal.save();

    await updateDailySummary(req.body.userId);

    res.json({ message: "Meal saved successfully" });

  } catch (error) {
    console.error("Confirm meal error:", error);
    res.status(500).json({ error: "Failed to save meal" });
  }
});


// =======================
// 🔥 GET MEAL HISTORY
// =======================
router.get("/meals", async (req, res) => {
  try {
    const meals = await Meal.find({
      userId: req.query.userId
    })
    .sort({ createdAt: -1 })
    .limit(10); 

    res.json(meals);

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch meals"
    });
  }
});


// =======================
// ❌ DELETE MEAL
// =======================
router.delete("/meal/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await Meal.findByIdAndDelete(id);

    if (meal) {
      await updateDailySummary(meal.userId); // 🔥 FIX
    }

    res.json({ message: "Meal deleted successfully" });

  } catch (error) {
    console.error("Delete meal error:", error);
    res.status(500).json({ message: "Error deleting meal" });
  }
});


router.get("/monthly-report", async (req, res) => {
  try {
    const userId = req.query.userId;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    // 🔥 GET ALL DAILY SUMMARIES FOR THIS MONTH
    const summaries = await DailySummary.find({
      userId,
      createdAt: { $gte: startOfMonth }
    });

    if (summaries.length === 0) {
      return res.json({
        report: "No data available yet for this month."
      });
    }

    // 🔥 PREPARE DATA FOR AI
    const summaryText = summaries.map(day => {
      return `Date: ${day.date}, Calories: ${day.totalCalories}, Goal: ${day.goalCalories}, Difference: ${day.difference}`;
    }).join("\n");

    // 🔥 AI ANALYSIS
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a nutrition coach. Analyze user eating habits and give short, clear advice."
        },
        {
          role: "user",
          content: `Here is my monthly eating data:\n${summaryText}\n\nGive a short report with advice.`
        }
      ]
    });

    const report = aiRes.choices[0].message.content;

    res.json({ report });

  } catch (error) {
    console.error("Monthly report error:", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});


module.exports = router;
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Profile = require("../models/Profile");

let cachedWorkout = null;
let lastWorkoutDate = null;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/chat", async (req, res) => {
  const { message, userId } = req.body;
  const today = new Date().toDateString();

  // 🔥 Workout cache
  if (message.toLowerCase().includes("workout")) {
    if (cachedWorkout && lastWorkoutDate === today) {
      return res.json({ reply: cachedWorkout, meal: null });
    }
  }

  try {
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const isFoodRequest =
      message.toLowerCase().includes("meal") ||
      message.toLowerCase().includes("food") ||
      message.toLowerCase().includes("eat") ||
      message.toLowerCase().includes("lunch") ||
      message.toLowerCase().includes("dinner");

    // 🔥 PROMPT
    const systemPrompt = `
You are NutriFit AI, a friendly and intelligent nutrition assistant.

USER PROFILE:
Goal: ${profile.goal}
Age: ${profile.age}
Weight: ${profile.weight} kg
Height: ${profile.height} cm
Activity Level: ${profile.activityLevel}
Diet Preference: ${profile.dietaryPreference}
Daily Calorie Target: ${profile.calculatedCalories} kcal

RULES:
- If the user greets (hi, hello), respond normally (NO meal).
- If the user asks about food, recommend ONE meal.
- Always use the user profile to tailor recommendations.
- Keep tone conversational and friendly.
- Include estimated calories.
- Include 3–5 simple cooking steps.
- Keep steps beginner-friendly.

FORMAT FOR FOOD:

Meal:
<meal name>

Calories:
<calories>

Steps:
1. Step one
2. Step two
3. Step three
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    });

    const reply = response.choices[0].message.content;

// 🔥 FORCE CLEAN EXTRACTION
let mealName = null;
let steps = [];

if (isFoodRequest) {
  // Extract meal name safely
  const mealMatch = reply.match(/Meal:\s*(.*)/i);
  if (mealMatch) {
    mealName = mealMatch[1].trim();
  }

  // Extract steps safely
 const stepsMatch = reply.split("Steps:");

if (stepsMatch[1]) {
  steps = stepsMatch[1]
    .split(/\d+\.\s/) // split by "1. 2. 3."
    .map(s => s.trim())
    .filter(s => s.length > 0);
}
}

// 🔥 FALLBACK (VERY IMPORTANT)
if (!mealName) {
  mealName = "Healthy Meal";
}

// 🔥 FIXED LINKS
const image = `https://source.unsplash.com/600x400/?${mealName.replace(/ /g, ",")},food`;
const youtube = `https://www.youtube.com/results?search_query=how+to+cook+${mealName.replace(/ /g, "+")}+recipe`;

// 🔥 FINAL RESPONSE
res.json({
  reply: isFoodRequest
    ? `I recommend ${mealName}. It's a great choice for your goal.`
    : reply,
  meal: isFoodRequest
    ? {
        name: mealName,
        image,
        steps,
        youtube
      }
    : null
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI error" });
  }
});

module.exports = router;
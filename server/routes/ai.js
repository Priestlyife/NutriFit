const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Profile = require("../models/Profile");

// 🔥 CACHE WORKOUT
let cachedWorkout = null;
let lastWorkoutDate = null;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/chat", async (req, res) => {
  const { message, userId } = req.body;

  const today = new Date().toDateString();

  // 🔥 WORKOUT CACHE
  if (message.toLowerCase().includes("workout")) {
    if (cachedWorkout && lastWorkoutDate === today) {
      return res.json({ reply: cachedWorkout, meal: null });
    }
  }

  try {
    // 🔥 GET USER PROFILE
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // 🔥 SMART PROMPT (UPDATED)
    const systemPrompt = `
You are NutriFit AI, a smart nutrition assistant.

USER PROFILE:
Goal: ${profile.goal}
Age: ${profile.age}
Weight: ${profile.weight} kg
Height: ${profile.height} cm
Activity Level: ${profile.activityLevel}
Diet Preference: ${profile.dietaryPreference}
Daily Calories: ${profile.calculatedCalories} kcal

RULES:
- If user is greeting (hi, hello), reply normally (NO meal).
- If user asks about food, recommend ONE meal.
- Keep explanation short (1–2 sentences).
- Include estimated calories.
- MOST IMPORTANT: Include SIMPLE cooking steps (3–5 steps max).

FORMAT STRICTLY (ONLY for food requests):

Meal:
<meal name>

Calories:
<estimated calories>

Steps:
1. Step one
2. Step two
3. Step three
`;

    // 🔥 HANDLE WORKOUT REQUEST
    let finalPrompt = message;

    if (message.toLowerCase().includes("workout")) {
      finalPrompt = `
Generate a simple workout plan.

Format EXACTLY like this:

Exercises:
1. Push-ups | reps: 10 | sets: 3
2. Squats | reps: 12 | sets: 3
3. Plank | duration: 30 sec
4. Jumping Jacks | reps: 20
5. Sit-ups | reps: 15

NO explanation.
`;
    }

    // 🔥 OPENAI CALL
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: finalPrompt }
      ]
    });

    const reply = response.choices[0].message.content;

    // 🔥 DETECT FOOD REQUEST
    const isFoodRequest =
      message.toLowerCase().includes("meal") ||
      message.toLowerCase().includes("food") ||
      message.toLowerCase().includes("eat") ||
      message.toLowerCase().includes("lunch") ||
      message.toLowerCase().includes("dinner");

    // 🔥 DEFAULT VALUES
    let mealName = null;
    let steps = [];
    let image = null;
    let youtube = null;

    if (isFoodRequest) {
      // 🔥 EXTRACT MEAL NAME
      try {
        const mealSection = reply.split("Meal:")[1];
        if (mealSection) {
          mealName = mealSection.split("\n")[0].trim();
        }
      } catch (e) {
        mealName = "Healthy Meal";
      }

      // 🔥 EXTRACT STEPS
      try {
        const stepsSection = reply.split("Steps:")[1];
        if (stepsSection) {
          steps = stepsSection
            .trim()
            .split("\n")
            .filter(line => line.trim() !== "");
        }
      } catch (e) {
        steps = [];
      }

      // 🔥 IMAGE + YOUTUBE
      image = `https://source.unsplash.com/featured/?${mealName}`;
      youtube = `https://www.youtube.com/results?search_query=${mealName}+recipe`;
    }

    // 🔥 SAVE WORKOUT CACHE
    if (message.toLowerCase().includes("workout")) {
      cachedWorkout = reply;
      lastWorkoutDate = today;
    }

    // 🔥 FINAL RESPONSE
    res.json({
      reply,
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

    res.status(500).json({
      message: "AI error"
    });
  }
});

module.exports = router;
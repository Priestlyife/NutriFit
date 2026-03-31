const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Profile = require("../models/Profile");

// 🔥 CACHE WORKOUT (add here)
let cachedWorkout = null;
let lastWorkoutDate = null;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/chat", async (req, res) => {

  const { message, userId } = req.body;

  const today = new Date().toDateString();

// 🔥 If it's workout request, return cached version
if (message.toLowerCase().includes("workout")) {
  if (cachedWorkout && lastWorkoutDate === today) {
    return res.json({ reply: cachedWorkout });
  }
}

  try {

    // Fetch user profile
    const profile = await Profile.findOne({ userId });
    console.log("AI Profile:", profile);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const systemPrompt = `
You are NutriFit AI, a nutrition coach inside a fitness tracking app.

IMPORTANT:
The user's profile information is already provided.
NEVER ask the user for their diet preference, restrictions, or goal again.

USER PROFILE:
Goal: ${profile.goal}
Age: ${profile.age}
Weight: ${profile.weight} kg
Height: ${profile.height} cm
Activity Level: ${profile.activityLevel}
Diet Preference: ${profile.dietaryPreference}
Daily Calorie Target: ${profile.calculatedCalories} kcal

RULES:
- Always use the user profile when giving advice.
- Never ask for more user information.
- Always recommend a specific meal when asked about food.
- Keep answers SHORT (2–4 sentences).
- Include estimated calories in recommendations.
- Focus on meals that support the user's goal.

Example format:

Recommended Lunch:
Grilled chicken quinoa bowl  
Calories: ~520 kcal  
High protein meal suitable for ${profile.goal}.
`;


// 🔥 FIX WORKOUT PROMPT
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: finalPrompt
        }
      ]
    });

    const reply = response.choices[0].message.content;


    // 🔥 Save today's workout
if (message.toLowerCase().includes("workout")) {
  cachedWorkout = reply;
  lastWorkoutDate = today;
}

    res.json({ reply });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "AI error"
    });

  }

});

module.exports = router;
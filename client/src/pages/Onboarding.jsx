import { useState } from "react";
import API from "../config";
import "../styles/onboarding.css";

function Onboarding() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ FIX 1: define slides
  const slides = 5;

  // ✅ form state
  const [formData, setFormData] = useState({
    goal: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    unit: "metric",
    activity: "",
    diet: "",
    weeklyTarget: ""
  });

  // ✅ change handler
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = async () => {
  if (isLoading) return;

  // ✅ VALIDATION FIRST (NO LOADING YET)
  if (step === 0 && !formData.goal) return;

  if (
    step === 1 &&
    (!formData.age ||
      !formData.gender ||
      !formData.height ||
      !formData.weight)
  )
    return;

  if (step === 2 && !formData.activity) return;
  if (step === 3 && !formData.diet) return;
  if (step === 4 && !formData.weeklyTarget) return;

  // 👉 ONLY NOW start loading
  setIsLoading(true);

  try {
    if (step === slides - 1) {
      const calories = calculateCalories();

      if (!calories || isNaN(calories)) {
        alert("Please complete all fields properly");
        return;
      }

      const userData = localStorage.getItem("user");

      if (!userData) {
        alert("User not found. Please login again.");
        return;
      }

      const user = JSON.parse(userData);

      const finalUserData = {
        userId: user._id || user.id, // ✅ FIXED
        goal: formData.goal,
        age: formData.age,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        activityLevel: formData.activity,
        dietaryPreference: formData.diet,
        weeklyTarget: formData.weeklyTarget,
        calculatedCalories: calories
      };

      const response = await fetch(`${API}/api/profile/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalUserData)
      });

      const data = await response.json();

      console.log("PROFILE RESPONSE:", data);

      if (!response.ok) {
  console.error("Backend:", data);

  // ✅ If backend still saved it, continue
  if (data?.success || data?.profile) {
    window.location.href = "/dashboard";
    return;
  }

  alert(data.message || "Failed to save profile");
  return;
}

      setTimeout(() => {
  window.location.href = "/dashboard";
}, 300);
      return;
    }

    setStep(step + 1);

  } catch (error) {
    console.error("Onboarding error:", error);
    alert("Something went wrong. Check connection.");
  } finally {
    setIsLoading(false);
  }
};

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };


  const calculateCalories = () => {
  let weight = parseFloat(formData.weight);
  let height = parseFloat(formData.height);
  let age = parseInt(formData.age);

  // 🚨 SAFETY CHECK
  if (!weight || !height || !age || !formData.activity) {
    console.error("Invalid data for calorie calculation");
    return 2000; // fallback
  }

  if (formData.unit === "imperial") {
    weight = weight * 0.453592;
    height = height * 2.54;
  }

  let bmr;

  if (formData.gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    athlete: 1.9
  };

  let tdee = bmr * activityMultipliers[formData.activity];

  if (formData.goal === "lose") tdee -= 500;
  if (formData.goal === "gain") tdee += 500;

  return Math.round(tdee);
};

  return (
    <div className="onboarding-container">

      {/* LEFT SIDE */}
      <div className="onboarding-left">
        <div className="left-content">
          <div className="brand-badge">NutriFit</div>
          <h1>Build Your Perfect Diet Plan</h1>
          <p>
            Let NutriFit personalize your nutrition journey with intelligent calorie recommendations.
          </p>
        </div>

        {/* Floating Icons */}
        <span className="food-icon icon1">🥗</span>
        <span className="food-icon icon2">🍎</span>
        <span className="food-icon icon3">🥑</span>
        <span className="food-icon icon4">🍗</span>
        <span className="food-icon icon5">🍕</span>
        <span className="food-icon icon6">🍔</span>
        <span className="food-icon icon7">🐟</span>
        <span className="food-icon icon8">🥦</span>
        <span className="food-icon icon9">🍇</span>
        <span className="food-icon icon10">🥕</span>
      </div>

      {/* RIGHT SIDE */}
      <div className="onboarding-right">
        <div className="onboarding-card">

          {/* Progress */}
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((step + 1) / slides) * 100}%` }}
            />
          </div>

          <div className="slider-container">

            {step === 0 && (
              <div className="slide fade-in">
                <h2>Select Your Goal</h2>

                <div className="goal-options">
                  {["gain", "maintain", "lose"].map(goal => (
                    <div
                      key={goal}
                      className={`selection-card ${formData.goal === goal ? "active" : ""}`}
                      onClick={() => handleChange("goal", goal)}
                    >
                      <div className="card-icon">
                        {goal === "gain" && "🏋️"}
                        {goal === "maintain" && "⚖️"}
                        {goal === "lose" && "🔥"}
                      </div>
                      <div className="card-text">
                        <h3>
                          {goal === "gain" && "Gain Muscle"}
                          {goal === "maintain" && "Maintain Weight"}
                          {goal === "lose" && "Lose Fat"}
                        </h3>
                        <p>
                          {goal === "gain" && "Build strength and muscle mass"}
                          {goal === "maintain" && "Keep your current physique"}
                          {goal === "lose" && "Shed body fat and tone up"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="slide fade-in">
                <h2>Basic Information</h2>

                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleChange("age", e.target.value)}
                    placeholder="e.g. 28"
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <div className="gender-options">
                    {["male", "female", "other"].map(gender => (
                      <div
                        key={gender}
                        className={`pill-card ${formData.gender === gender ? "active" : ""}`}
                        onClick={() => handleChange("gender", gender)}
                      >
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Height ({formData.unit === "metric" ? "cm" : "in"})
                    </label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleChange("height", e.target.value)}
                      placeholder={formData.unit === "metric" ? "175" : "68"}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Weight ({formData.unit === "metric" ? "kg" : "lbs"})
                    </label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleChange("weight", e.target.value)}
                      placeholder={formData.unit === "metric" ? "70" : "154"}
                    />
                  </div>
                </div>

                <div className="toggle-unit">
                  <span
                    className={formData.unit === "metric" ? "active" : ""}
                    onClick={() => handleChange("unit", "metric")}
                  >
                    Metric (cm/kg)
                  </span>
                  <span
                    className={formData.unit === "imperial" ? "active" : ""}
                    onClick={() => handleChange("unit", "imperial")}
                  >
                    Imperial (in/lbs)
                  </span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="slide fade-in">
                <h2>Activity Level</h2>

                <div className="activity-options">
                  {[
                    { id: "sedentary", label: "Sedentary", desc: "Little or no exercise, desk job" },
                    { id: "light", label: "Lightly Active", desc: "Light exercise or sports 1–3 days/week" },
                    { id: "moderate", label: "Moderately Active", desc: "Moderate exercise 3–5 days/week" },
                    { id: "very", label: "Very Active", desc: "Hard exercise 6–7 days/week" },
                    { id: "athlete", label: "Athlete", desc: "Very intense physical training or physical job" }
                  ].map(level => (
                    <div
                      key={level.id}
                      className={`detail-card ${formData.activity === level.id ? "active" : ""}`}
                      onClick={() => handleChange("activity", level.id)}
                    >
                      <h3>{level.label}</h3>
                      <p>{level.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="slide fade-in">
                <h2>Dietary Preferences</h2>

                <div className="diet-options">
                  {[
                    { id: "none", label: "No Preference", icon: "🍽️" },
                    { id: "vegetarian", label: "Vegetarian", icon: "🥗" },
                    { id: "vegan", label: "Vegan", icon: "🌱" },
                    { id: "keto", label: "Keto", icon: "🥑" },
                    { id: "high-protein", label: "High Protein", icon: "🥩" },
                    { id: "low-carb", label: "Low Carb", icon: "🥦" }
                  ].map(option => (
                    <div
                      key={option.id}
                      className={`grid-card ${formData.diet === option.id ? "active" : ""}`}
                      onClick={() => handleChange("diet", option.id)}
                    >
                      <span className="grid-icon">{option.icon}</span>
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="slide fade-in">
                <h2>Weekly Target</h2>

                <div className="weekly-options">
                  {[
                    { id: "slow", label: "Slow Progress", desc: "0.25kg / 0.5lbs per week (Most Sustainable)" },
                    { id: "moderate", label: "Moderate Progress", desc: "0.5kg / 1lb per week (Recommended)" },
                    { id: "aggressive", label: "Aggressive Progress", desc: "1kg / 2lbs per week (Strict & Challenging)" }
                  ].map(option => (
                    <div
                      key={option.id}
                      className={`detail-card ${formData.weeklyTarget === option.id ? "active" : ""}`}
                      onClick={() => handleChange("weeklyTarget", option.id)}
                    >
                      <h3>{option.label}</h3>
                      <p>{option.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="button-row">
              <button
                className={`btn-secondary ${step === 0 ? "hidden" : ""}`}
                onClick={prevStep}
                disabled={step === 0}
              >
                Back
              </button>
              <button
  className="btn-primary"
  onClick={nextStep}
  disabled={isLoading}
>
  {isLoading
    ? "Saving..."
    : step === slides - 1
    ? "Complete Setup"
    : "Continue"}
</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
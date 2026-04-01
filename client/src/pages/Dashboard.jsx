import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";

import "../styles/dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer  
} from "recharts";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.name || "User";
  const [question, setQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [profile, setProfile] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [recommendedMeal, setRecommendedMeal] = useState("");
  const [weeklyCalories, setWeeklyCalories] = useState([]);
  const [macroData, setMacroData] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState("");

  useEffect(() => {

  const fetchData = async () => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      // Fetch profile
      const profileRes = await axios.get(
        `${API}/api/profile/${user.id}`
      );

      setProfile(profileRes.data);

      // Fetch meals
      const mealsRes = await axios.get(
  `${API}/api/ai/meals?userId=${user.id}`
);
// 🔥 CALCULATE MACROS
const protein = mealsRes.data.reduce((sum, m) => sum + (m.protein || 0), 0);
const carbs = mealsRes.data.reduce((sum, m) => sum + (m.carbs || 0), 0);
const fats = mealsRes.data.reduce((sum, m) => sum + (m.fat || 0), 0);

setMacroData([
  { name: "Protein", value: protein },
  { name: "Carbs", value: carbs },
  { name: "Fats", value: fats }
]);




// 🔥 CALCULATE WEEKLY CALORIES
const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const weekly = days.map((day, index) => {
  const today = new Date();
const dayDate = new Date(today);
dayDate.setDate(today.getDate() - today.getDay() + index);

  const dayMeals = mealsRes.data.filter(meal => {
    const mealDate = new Date(meal.createdAt);
    return mealDate.toDateString() === dayDate.toDateString();
  });

  const total = dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);

  return { day, calories: total };
});

setWeeklyCalories(weekly);





      // 🔥 FILTER ONLY TODAY'S MEALS
const today = new Date();

const todayMeals = mealsRes.data.filter(meal => {
  const mealDate = new Date(meal.createdAt);
  return mealDate.toDateString() === today.toDateString();
});

// 🔥 CALCULATE TODAY ONLY
const total = todayMeals.reduce((sum, meal) => {
  return sum + parseInt(meal.calories || 0);
}, 0);

setTotalCalories(total);

    } catch (error) {

      console.error("Dashboard fetch error:", error);

    }

  };


  fetchData();

  // const interval = setInterval(fetchData, 15000);
  // return () => clearInterval(interval);

}, []);

useEffect(() => {
  const getMeal = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.post(
        `${API}/api/ai/chat`,
        {
          message: "Suggest a healthy meal for today",
          userId: user.id
        }
      );

      setRecommendedMeal(res.data.reply);

    } catch (error) {
      console.error("AI meal error:", error.response?.data || error.message);
    }
  };

  getMeal();
}, []);


useEffect(() => {
  const fetchReport = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
  `${API}/api/ai/monthly-report?userId=${user.id}`
);

      setMonthlyReport(res.data.report);

    } catch (error) {
      console.error("Monthly report error:", error);
    }
  };

  fetchReport();
}, []);



  const askAI = async () => {
    if(!question.trim()) return;

    setLastQuestion(question);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

const res = await axios.post(
  `${API}/api/ai/chat`,
  { 
    message: question,
    userId: user.id
  }
);

      setAiResponse(res.data.reply);
      setQuestion("");

    } catch(error) {
      console.log(error);
      setAiResponse("AI server error");
    }
  };

  const caloriesConsumed = totalCalories;
  const calorieGoal = Math.round(profile?.calculatedCalories || 2200);
  const remainingCalories = Math.round(
  Math.max(calorieGoal - caloriesConsumed, 0)
);
  const rawPercentage = (caloriesConsumed / calorieGoal) * 100;
const percentage = Math.min(Math.round(rawPercentage), 100);
const isOver = caloriesConsumed > calorieGoal;


  

  // Calculate total macros dynamically for the percentage legend
  const totalMacros = macroData.reduce((acc, curr) => acc + curr.value, 0);
  const COLORS = ["#2e7d32", "#66bb6a", "#a5d6a7"];

  

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>Welcome Back, {userName} 👋</h1>
          <span>Here’s your health overview for today</span>
        </div>
      </div>

      {/* TOP SECTION */}
<div className="dashboard-grid">

  {/* LEFT SIDE */}
  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

    {/* CALORIE RING */}
    <div className="glass-card">
      <h3>Daily Calories</h3>

      <div className="ring-container">
        <div
          className="ring"
          style={{
            background: `conic-gradient(${isOver ? "#e53935" : "#2e7d32"} ${percentage}%, rgba(46, 125, 50, 0.1) 0%)`
          }}
        >
          <div className="ring-inner">
            <h2>{caloriesConsumed}</h2>
            <span>/ {calorieGoal} kcal</span>

            {!isOver ? (
              <span style={{ fontSize: "12px", color: "#2e7d32" }}>
                Remaining {remainingCalories} kcal
              </span>
            ) : (
              <span style={{ fontSize: "12px", color: "#e53935" }}>
                Exceeded by {Math.abs(calorieGoal - caloriesConsumed)} kcal
              </span>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* MONTHLY REPORT */}
    <div className="glass-card">
      <h3>📊 Monthly AI Report</h3>

      <p style={{ marginTop: "10px", lineHeight: "1.6" }}>
        {monthlyReport || "Generating report..."}
      </p>
    </div>

  </div>

  {/* RIGHT SIDE (AI COACH) */}
  <div className="glass-card ai-coach">

    <div className="ai-header">
      <div className="ai-avatar">🤖</div>

      <div>
        <h3>NutriFit AI Coach</h3>
        <p>Your personal nutrition assistant</p>
      </div>
    </div>

    <p className="ai-description">
      I can help analyze your meals, calculate calories from food images,
      and generate meal plans based on your fitness goal.
    </p>

    <button
      className="ai-btn"
      onClick={()=>window.location.href="/meals"}
    >
      📷 Scan Food
    </button>

    {/* AI CHAT */}
    <div className="ai-chat">
      {lastQuestion && <div className="user-message">👤 {lastQuestion}</div>}
      {aiResponse && <div className="ai-message">🤖 {aiResponse}</div>}
    </div>

    {/* RECOMMENDED MEAL */}
    <div className="glass-card" style={{ marginTop: "15px" }}>
      <h3>Recommended Meal</h3>
      <p style={{lineHeight:"1.6", marginTop:"10px"}}>
        {recommendedMeal || "Generating recommendation..."}
      </p>
    </div>

    {/* INPUT */}
    <div className="ai-chat-input">
      <input
        type="text"
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
        placeholder="Ask NutriFit AI anything..."
        onKeyDown={(e) => e.key === 'Enter' && askAI()}
      />

      <button className="send-btn" onClick={askAI}>
        ➤
      </button>
    </div>

  </div>

</div>

      {/* STATS */}
      <div className="dashboard-row">
        <div className="glass-card stat-card">
          <h3>💧 Water Intake</h3>
          <p>1.8L</p>
        </div>

        <div className="glass-card stat-card">
          <h3>👟 Steps</h3>
          <p>8,462</p>
        </div>

        <div className="glass-card stat-card">
          <h3>😴 Sleep</h3>
          <p>6h 45m</p>
        </div>

        <div className="glass-card stat-card">
          <h3>⚖️ Weight</h3>
          <p>72.5kg</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="dashboard-grid" style={{ marginTop: "25px" }}>

        <div className="glass-card">
          <h3>Weekly Calories</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyCalories}>
              <XAxis dataKey="day" stroke="#66bb6a" tick={{fill: '#2e7d32', fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
              <YAxis stroke="#66bb6a" tick={{fill: '#2e7d32', fontWeight: 500}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#2e7d32"
                strokeWidth={4}
                dot={{ r: 5, fill: '#2e7d32', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, fill: '#1b5e20' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <h3>Macronutrients</h3>

          {/* Flex container to place chart and legend side-by-side */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
            
            {/* Chart Wrapper */}
            <div style={{ flex: "1 1 200px" }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={macroData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Wrapper */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", minWidth: "130px", paddingRight: "10px" }}>
              {macroData.map((entry, index) => {
                const macroPercentage = totalMacros
  ? Math.round((entry.value / totalMacros) * 100)
  : 0;
                
                return (
                  <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px" }}>
                    <span 
                      style={{ 
                        width: "14px", 
                        height: "14px", 
                        borderRadius: "4px", 
                        backgroundColor: COLORS[index] 
                      }}
                    ></span>
                    <span style={{ fontWeight: 600, color: "#1b5e20", minWidth: "60px" }}>
                      {entry.name}
                    </span>
                    <span style={{ color: "#555", fontWeight: 500 }}>
                      — {macroPercentage}%
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </>
  );
}

export default Dashboard;
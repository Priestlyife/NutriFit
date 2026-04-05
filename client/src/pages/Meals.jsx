import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";
import "../styles/meals.css";

function Meals() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMeal, setPendingMeal] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatReply, setChatReply] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatMeal, setChatMeal] = useState(null);



  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

const res = await axios.get(
  `${API}/api/ai/meals?userId=${user.id}`
);
      setMeals(res.data);
    } catch (error) {
      console.error("Error fetching meals:", error.response?.data || error.message);
    }
  };

  const scanFood = async () => {

  if (!image) return;

  setIsLoading(true);
  setResult("");

  const user = JSON.parse(localStorage.getItem("user"));

  const formData = new FormData();
  formData.append("image", image);
  formData.append("userId", user.id);

  try {

    const res = await axios.post(
  `${API}/api/ai/scan-food`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }
);

    setResult(res.data.result);
    setPendingMeal(res.data.mealData);
    fetchMeals();

  } catch (error) {

    console.error(error);
    setResult("⚠️ AI error analyzing food. Please try again.");

  } finally {

    setIsLoading(false);

  }

};

const askMealAI = async () => {
  if (!chatMessage.trim()) return;

  const messageToSend = chatMessage; // store message
  setChatMessage(""); // 🔥 clear input immediately

  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const res = await axios.post(
  `${API}/api/ai/chat`,
      {
        message: messageToSend,
        userId: user.id
      }
    );

    setChatHistory(prev => [
  ...prev,
  { type: "user", text: messageToSend },
  { type: "ai", text: res.data.reply, meal: res.data.meal }
]);

  } catch (error) {
    console.error(error);
    setChatReply("⚠️ AI error. Try again.");
  }
};

  return (
    <div className="meals-page">
      <div className="meals-header">
        <h1 className="page-title">My Meals</h1>
        <p className="page-subtitle">Track, scan, and discover healthy food.</p>
      </div>

      {/* SCAN FOOD CARD */}
      <div className="scan-card">
        <div className="scan-content">
          <div className="scan-info">
            <h3>Scan Food</h3>
            <p>Upload a photo of your meal to get AI-powered nutritional insights.</p>
          </div>
          <div className="scan-actions">
            {/* Custom styled file upload */}
            <label className="custom-file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />
              {image ? image.name : "Choose Image"}
            </label>
            <button 
              onClick={scanFood} 
              className="scan-btn" 
              disabled={!image || isLoading}
            >
              {isLoading ? "Scanning..." : "Analyze Meal"}
            </button>
          </div>
        </div>
      </div>

      {/* RESULT CARD */}
      {(preview || result) && (
        <div className="result-card">
          {preview && (
            <div className="image-container">
              <img src={preview} alt="food preview" className="food-image" />
            </div>
          )}
          {result && (
            <div className="nutrition-info">
              <h3>Nutrition Insights</h3>
              <div className="result-box">
                <pre>{result}</pre>
                <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>

  <button
    onClick={async () => {
      try {
        await axios.post(
  `${API}/api/ai/confirm-meal`,
  pendingMeal
);

// 🔥 FORCE UI RESET FIRST
setPendingMeal(null);
setResult("");
setPreview(null);
setImage(null); // ✅ THIS WAS MISSING

// 🔥 THEN refresh meals AFTER
  fetchMeals();

      } catch (err) {
        console.error(err);
      }
    }}
    style={{
      background: "#2e7d32",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      transition: " 0.3s",
    }}
    onMouseDown={(e) => e.target.style.transform = "scale(0.95)"}
    onMouseUp={(e) => e.target.style.transform = "scale(1)"}
  >
    ✅ Add Meal
  </button>

  <button
    onClick={() => {
      setPendingMeal(null);
      setResult("");
      setPreview(null);
      setImage(null);
    }}
    style={{
      background: "#e53935",
      color: "white",
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer"
    }}
  >
    ❌ Cancel
  </button>

</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI CHATBOX */}
<div className="glass-card" style={{ marginTop: "20px", paddingBottom: "20px" }}>
  <h3>🤖 Meal AI Assistant</h3>

  <p style={{ fontSize: "14px", marginBottom: "10px" }}>
    Ask anything about food, calories, diet, or weight loss.
  </p>

  {/* CHAT DISPLAY */}
  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
  {chatHistory.map((chat, index) => (
    <div key={index} style={{ display: "flex", flexDirection: "column" }}>
      
      {chat.type === "user" && (
        <div style={{
          alignSelf: "flex-end",
          background: "#2e7d32",
          color: "white",
          padding: "10px",
          borderRadius: "10px",
          maxWidth: "70%"
        }}>
          {chat.text}
        </div>
      )}

      {chat.type === "ai" && (
        <div style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "10px",
          maxWidth: "70%"
        }}>
          <p style={{ marginBottom: "10px" }}>🤖 {chat.text}</p>

          {chat.meal && (
            <div>
              <h4 style={{ marginTop: "10px", marginBottom: "10px" }}>
  🍽 {chat.meal.name}
</h4>

              <img
  src={chat.meal.image}
  alt="meal"
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/400x300?text=Meal+Image";
  }}
  style={{ width: "100%", borderRadius: "10px" }}
/>

              <h5 style={{ marginTop: "10px" }}>👨‍🍳 Steps:</h5>
              <ol>
                {chat.meal.steps.map((step, i) => (
  <li key={i}>{step}</li>
))}
              </ol>

              <a 
  href={chat.meal.youtube} 
  target="_blank"
  style={{
    display: "inline-block",
    marginTop: "10px",
    color: "#e53935",
    fontWeight: "bold"
  }}
>
                ▶ Watch on YouTube
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  ))}
</div>

  {/* INPUT */}
  <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
    <input
      type="text"
      value={chatMessage}
      onChange={(e) => setChatMessage(e.target.value)}
      placeholder="Ask about your meals..."
      style={{
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd"
      }}
      onKeyDown={(e) => e.key === "Enter" && askMealAI()}
    />

    <button
      onClick={askMealAI}
      style={{
        background: "#2e7d32",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      Ask
    </button>
  </div>
</div>

      {/* RECOMMENDED MEALS */}
      <div className="recommend-section">
        <h3>Recommended Meals</h3>
        <div className="meal-grid">
          <div className="meal-card">
            <img src="https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80" alt="Jollof Rice"/>
            <div className="meal-card-content">
              <p>Jollof Rice</p>
            </div>
          </div>
          <div className="meal-card">
            <img src="https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=600&q=80" alt="Grilled Chicken"/>
            <div className="meal-card-content">
              <p>Grilled Chicken</p>
            </div>
          </div>
          <div className="meal-card">
            <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80" alt="Salmon"/>
            <div className="meal-card-content">
              <p>Salmon Plate</p>
            </div>
          </div>
          <div className="meal-card">
            <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80" alt="Fruit Bowl"/>
            <div className="meal-card-content">
              <p>Fresh Fruit Bowl</p>
            </div>
          </div>
          <div className="meal-card">
            <img src="https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=80" alt="Egg Omelette"/>
            <div className="meal-card-content">
              <p>Egg Omelette</p>
            </div>
          </div>
          <div className="meal-card">
            <img src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80" alt="Chicken Wrap"/>
            <div className="meal-card-content">
              <p>Chicken Wrap</p>
            </div>
          </div>
        </div>
      </div>

      

      <div className="bottom-sections">
        {/* COOKING TUTORIAL */}
        <div className="tutorial-card card-modern">
          <h3>Quick Cooking Guide</h3>
          <ul className="tutorial-list">
            <li><span>1</span> Prepare your rice or base food</li>
            <li><span>2</span> Add lean protein like chicken, fish, or beef</li>
            <li><span>3</span> Include colorful vegetables for balance</li>
            <li><span>4</span> Cook using healthy oils (olive, avocado)</li>
            <li><span>5</span> Serve in proper portions</li>
          </ul>
        </div>

        {/* MEAL HISTORY */}
        <div className="history-card card-modern">
          <h3>Recent History</h3>
          {meals.length === 0 ? (
            <p className="empty-state">No meals tracked yet.</p>
          ) : (
            <div className="history-list">
              {meals.map((meal) => (
                <div key={meal._id} className="history-item">
                  <strong>{meal.food}</strong>
                  <div className="macro-row">
                    {/* Removed hardcoded units to prevent duplication from API data */}
                    <span className="macro badge-cal">🔥 {meal.calories}</span>
                    <span className="macro badge-pro">🥩 {meal.protein}</span>
                    <span className="macro badge-carb">🍞 {meal.carbs}</span>
                    <span className="macro badge-fat">🥑 {meal.fat}</span>
                  </div>

                  <button
  onClick={async () => {
    console.log("Deleting:", meal._id);

    try {
      await axios.delete(
        `${API}/api/ai/meal/${meal._id}`
      );

      // 🔥 IMPORTANT: update UI instantly
      setMeals((prev) => prev.filter((m) => m._id !== meal._id));

    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data || err.message);
    }
  }}
  style={{
    marginTop: "8px",
    background: "#ff5252",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  Delete
</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Meals;
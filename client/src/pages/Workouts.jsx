import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";
import "../styles/workout.css";

function Workouts() {
  const [plan, setPlan] = useState("");
  const [exercises, setExercises] = useState([]);
  const [completed, setCompleted] = useState({});

  // 🔥 Stable, high-quality fitness images from Unsplash
  const exerciseMedia = {
    "Push-ups": {
      image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=600&auto=format&fit=crop",
      video: "https://www.youtube.com/watch?v=IODxDxX7oi4"
    },
    "Squats": {
      image: "https://images.unsplash.com/photo-1571019613914-85f342c55f0b?q=80&w=600&auto=format&fit=crop",
      video: "https://www.youtube.com/watch?v=aclHkVaku9U"
    },
    "Plank": {
      image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=600&auto=format&fit=crop",
      video: "https://www.youtube.com/watch?v=pSHjTRCQxIw"
    },
    "Jumping Jacks": {
      image: "https://images.unsplash.com/photo-1594737625785-cb02d5d7b2a1?q=80&w=600&auto=format&fit=crop",
      video: "https://www.youtube.com/watch?v=c4DAnQ6DtF8"
    },
    "Sit-ups": {
      image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=600&auto=format&fit=crop",
      video: "https://www.youtube.com/watch?v=1fbU_MkV7NE"
    }
  };

  // Default image if AI generates an exercise not in our dictionary
  const defaultImage = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop";

  // 🔥 Fetch AI workout
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const res = await axios.post(
  `${API}/api/ai/chat`,
          {
            message: "Generate a simple workout plan",
            userId: user.id
          }
        );

        const text = res.data.reply;
        setPlan(text);

        // 🔥 Extract exercises from AI
        const lines = text.split("\n").filter(line => line.includes("|"));

        const parsed = lines.map(line => {
          const parts = line.split("|");
          return parts[0].replace(/\d+\.\s*/, "").trim();
        });

        // 🔥 FALLBACK if AI fails
        if (parsed.length === 0) {
          setExercises(["Push-ups", "Squats", "Plank", "Jumping Jacks", "Sit-ups"]);
        } else {
          setExercises(parsed);
        }

      } catch (error) {
        console.error("Workout error:", error);
        setExercises(["Push-ups", "Squats", "Plank", "Jumping Jacks", "Sit-ups"]);
      }
    };

    fetchWorkout();
  }, []);

  // 🔥 Toggle complete
  const toggleDone = (exercise) => {
    setCompleted((prev) => ({
      ...prev,
      [exercise]: !prev[exercise]
    }));
  };

  // Calculate Progress
  const totalExercises = exercises.length;
  const finishedExercises = Object.values(completed).filter(v => v).length;
  const progressPercent = totalExercises === 0 ? 0 : Math.round((finishedExercises / totalExercises) * 100);

  // Helper function to format AI Text beautifully
  const renderFormattedPlan = (text) => {
    if (!text) return <p className="loading-text">Generating your personalized plan...</p>;

    const lines = text.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return null;

      // Make Days of the week or "Day X" look like headers
      if (trimmed.match(/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|day \d)/i)) {
        return <h4 key={index} className="plan-section-title">{trimmed}</h4>;
      }
      
      // Format bullet points
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return <li key={index} className="plan-bullet">{trimmed.substring(1).trim()}</li>;
      }

      return <p key={index} className="plan-text">{trimmed}</p>;
    });
  };

  return (
    <div className="workout-page">
      <div className="workout-header">
        <div>
          <h1 className="page-title">Workout Dashboard 💪</h1>
          <p className="page-subtitle">Track your daily fitness routine</p>
        </div>
      </div>

      {/* PROGRESS SECTION */}
      <div className="glass-card progress-card">
        <div className="progress-header">
          <h3>Daily Progress</h3>
          <span className="progress-text">{finishedExercises} / {totalExercises} Completed</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        {progressPercent === 100 && (
          <p className="success-message">🎉 Incredible job! You crushed today's workout.</p>
        )}
      </div>

      <div className="workout-grid-layout">
        {/* EXERCISES GRID */}
        <div className="exercises-section">
          <h3 className="section-heading">🔥 Today's Exercises</h3>
          
          <div className="exercise-grid">
            {exercises.map((ex, index) => {
              const media = exerciseMedia[ex] || { image: defaultImage };
              const isDone = completed[ex];

              return (
                <div key={index} className={`exercise-card ${isDone ? "done" : ""}`}>
                  <div className="exercise-image-wrapper">
                    <img
                      src={media.image}
                      alt={ex}
                      className="exercise-image"
                    />
                    {isDone && <div className="done-overlay">✓</div>}
                  </div>

                  <div className="exercise-content">
                    <h4>{ex}</h4>
                    
                    {media.video ? (
                      <a href={media.video} target="_blank" rel="noreferrer" className="video-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Watch Video
                      </a>
                    ) : (
                      <span className="no-video">No video available</span>
                    )}

                    <button
                      onClick={() => toggleDone(ex)}
                      className={`toggle-btn ${isDone ? "btn-completed" : "btn-pending"}`}
                    >
                      {isDone ? "Completed ✓" : "Mark as Done"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI PLAN SECTION */}
        <div className="ai-plan-section">
          <div className="glass-card ai-card">
            <div className="ai-card-header">
              <span className="ai-icon">🤖</span>
              <h3>Your AI Workout Plan</h3>
            </div>
            <div className="ai-formatted-content">
              <ul>
                {renderFormattedPlan(plan)}
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Workouts;
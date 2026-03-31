import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";
import "../styles/settings.css";

function Settings() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    gender: "",
    goal: "",
    activityLevel: ""
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // =========================
  // 🔥 FETCH PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setUserProfile(user);

          const res = await axios.get(
  `${API}/api/profile/${user.id}`
);

        if (res.data) {
          setForm(res.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // 🔥 HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // =========================
  // 🔥 SAVE PROFILE
  // =========================
  const handleSave = async () => {
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.put(
  `${API}/api/profile/update/${user.id}`,
  form
);
      showToast("Profile updated successfully", "success");

    } catch (error) {
      console.log(error);
      showToast("Error saving profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-page">
      
      {/* TOAST NOTIFICATION */}
      <div className={`toast-notification ${toast.show ? 'show' : ''} ${toast.type}`}>
        {toast.type === 'success' ? '✅' : '❌'} {toast.message}
      </div>

      <div className="settings-header">
        <div>
          <h1 className="page-title">Settings ⚙️</h1>
          <p className="page-subtitle">Manage your fitness profile and goals</p>
        </div>
      </div>

      <div className="settings-container">
        
        {/* AVATAR SECTION */}
        <div className="glass-card profile-header-card">
          <div className="avatar-wrapper">
            <div className="avatar">
              {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "👤"}
            </div>
          </div>
          <div className="profile-info">
            <h2>{userProfile?.name || "Fitness User"}</h2>
            <p>{userProfile?.email || "Update your details below"}</p>
          </div>
        </div>

        {/* MAIN SETTINGS FORM */}
        <div className="glass-card settings-main-card">
          
          {/* PROFILE INFO SECTION */}
          <div className="settings-section">
            <h3 className="section-title">👤 Personal Details</h3>
            
            <div className="form-grid">
              {/* AGE */}
              <div className="input-group">
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="age">Age</label>
              </div>

              {/* GENDER */}
              <div className="input-group">
                <select
                  name="gender"
                  id="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden></option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <label htmlFor="gender" className={form.gender ? 'active' : ''}>Gender</label>
              </div>

              {/* WEIGHT */}
              <div className="input-group">
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="weight">Weight (kg)</label>
                <span className="input-icon">⚖️</span>
              </div>

              {/* HEIGHT */}
              <div className="input-group">
                <input
                  type="number"
                  name="height"
                  id="height"
                  value={form.height}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="height">Height (cm)</label>
                <span className="input-icon">📏</span>
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* GOAL SECTION */}
          <div className="settings-section">
            <h3 className="section-title">🎯 Primary Goal</h3>
            
            <div className="goal-cards-container">
              {[
                { id: "lose", icon: "🔥", title: "Lose Weight", desc: "Burn fat & lean out" },
                { id: "maintain", icon: "⚖️", title: "Maintain", desc: "Keep current physique" },
                { id: "gain", icon: "💪", title: "Gain Muscle", desc: "Build strength & mass" }
              ].map((g) => (
                <div
                  key={g.id}
                  className={`goal-card ${form.goal === g.id ? "active" : ""}`}
                  onClick={() => setForm({ ...form, goal: g.id })}
                >
                  <div className="goal-icon">{g.icon}</div>
                  <h4>{g.title}</h4>
                  <p>{g.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" />

          {/* ACTIVITY LEVEL SECTION */}
          <div className="settings-section">
            <h3 className="section-title">🏃 Activity Level</h3>
            
            <div className="activity-pills-container">
              {[
                { value: "sedentary", label: "Sedentary", icon: "🛋️" },
                { value: "light", label: "Light Active", icon: "🚶" },
                { value: "moderate", label: "Moderate", icon: "🏃" },
                { value: "very", label: "Highly Active", icon: "⚡" }
              ].map((a) => (
                <div
                  key={a.value}
                  className={`activity-pill ${form.activityLevel === a.value ? "active" : ""}`}
                  onClick={() => setForm({ ...form, activityLevel: a.value })}
                >
                  <span className="pill-icon">{a.icon}</span>
                  {a.label}
                </div>
              ))}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="settings-actions">
            <button 
              className={`save-btn ${isLoading ? 'loading' : ''}`} 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loader"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Pages
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import Meals from "./pages/Meals";
import Workouts from "./pages/Workouts";
import Settings from "./pages/Settings";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <Router>

    {/* 🌿 GLOBAL FLOATING ICONS */}
    <div className="floating-icons">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="floating-icon"
          style={{
            left: Math.random() * 100 + "%",
            animationDuration: 10 + Math.random() * 15 + "s",
            fontSize: 20 + Math.random() * 30
          }}
        >
          {[
            "🍎","🍗","🥦","🍕","🥑","🍞","🍓","🥕",
            "🏋️","💪","🥗","🍳","🍔","🍚","🍤"
          ][Math.floor(Math.random() * 15)]}
        </span>
      ))}
    </div>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* ================= DASHBOARD ROUTES ================= */}
        <Route element={<DashboardLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/meals" element={<Meals />} />

          <Route path="/workouts" element={<Workouts />} />

          <Route path="/settings" element={<Settings />} />

        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Splash />} />

      </Routes>
    </Router>
  );
}

export default App;
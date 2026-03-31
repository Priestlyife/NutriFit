import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import "../../styles/dashboard.css";
import { FaHome, FaUtensils, FaDumbbell, FaCog } from "react-icons/fa";

function DashboardLayout() {

  const [open, setOpen] = useState(false);

  return (
    <div className="dashboard-wrapper">

      {/* Mobile menu toggle */}
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${open ? "active" : ""}`}>
        <div className="sidebar-brand">
          <h2>NF</h2>
        </div>

        <ul>

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? "active-link" : ""}
              onClick={() => setOpen(false)}
            >
              <FaHome className="nav-icon" /> Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/meals"
              className={({ isActive }) => isActive ? "active-link" : ""}
              onClick={() => setOpen(false)}
            >
              <FaUtensils className="nav-icon" /> Meals
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/workouts"
              className={({ isActive }) => isActive ? "active-link" : ""}
              onClick={() => setOpen(false)}
            >
              <FaDumbbell className="nav-icon" /> Workouts
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) => isActive ? "active-link" : ""}
              onClick={() => setOpen(false)}
            >
              <FaCog className="nav-icon" /> Settings
            </NavLink>
          </li>

        </ul>
      </div>

      {/* Main Page Content */}
      <div className="dashboard-content">
        <Outlet />
      </div>

    </div>
  );
}

export default DashboardLayout;
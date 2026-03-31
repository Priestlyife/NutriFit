import { NavLink } from "react-router-dom";

function Sidebar({ collapsed, toggleSidebar }) {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo">NF</div>

      <nav>
        <NavLink
to="/dashboard"
className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
>
Dashboard
</NavLink>

        <NavLink
to="/meals"
className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
>
Meals
</NavLink>

        <NavLink
to="/workouts"
className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
>
Workouts
</NavLink>

        <NavLink
to="/settings"
className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
>
Settings
</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
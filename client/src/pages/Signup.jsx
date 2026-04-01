import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../config";
import GoogleIcon from "../components/GoogleIcon";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
  `${API}/api/auth/register`,
  { name, email, password }
);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/onboarding");
    } catch (error) {
      console.log(error);
      alert("Signup failed");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
      fontFamily: "Arial, Helvetica, sans-serif",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      background: "rgba(255, 255, 255, 0.95)",
      backdropFilter: "blur(12px)",
      borderRadius: "24px",
      padding: "40px",
      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
      boxSizing: "border-box",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
    },
    brand: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#2e7d32",
      width: "48px",
      height: "48px",
      borderRadius: "14px",
      color: "white",
      fontSize: "24px",
      marginBottom: "16px",
      boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
    },
    title: {
      color: "#1b5e20",
      fontSize: "26px",
      fontWeight: "800",
      margin: "0 0 8px 0",
      letterSpacing: "-0.5px",
    },
    subtitle: {
      color: "#666",
      fontSize: "15px",
      margin: 0,
    },
    inputGroup: {
      marginBottom: "16px",
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      borderRadius: "12px",
      border: "1px solid #ccc",
      background: "#f9f9f9",
      fontSize: "15px",
      color: "#333",
      boxSizing: "border-box",
      outline: "none",
      transition: "all 0.2s ease",
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "#2e7d32",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "8px",
      transition: "all 0.2s ease",
    },
    dividerContainer: {
      display: "flex",
      alignItems: "center",
      margin: "24px 0",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background: "#ddd",
      border: "none",
    },
    dividerText: {
      margin: "0 12px",
      color: "#888",
      fontSize: "13px",
      fontWeight: "500",
    },
    googleButton: {
      width: "100%",
      padding: "14px",
      background: "white",
      border: "1px solid #ddd",
      borderRadius: "12px",
      color: "#333",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      transition: "all 0.2s ease",
    },
    footer: {
      marginTop: "24px",
      textAlign: "center",
      fontSize: "14px",
      color: "#666",
    },
    linkStyle: {
      color: "#2e7d32",
      fontWeight: "600",
      textDecoration: "none",
      transition: "color 0.2s ease",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          .auth-input:focus {
            border-color: #2e7d32 !important;
            background: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1) !important;
          }
          .auth-btn:hover {
            background: #1b5e20 !important;
            transform: translateY(-2px);
          }
          .auth-btn:active {
            transform: translateY(0);
          }
          .google-btn:hover {
            background: #f9f9f9 !important;
            border-color: #ccc !important;
          }
          .auth-link:hover {
            color: #1b5e20 !important;
            text-decoration: underline !important;
          }
          @media (max-width: 480px) {
            .auth-card {
              padding: 30px 20px !important;
            }
          }
        `}
      </style>

      <div style={styles.card} className="auth-card">
        <div style={styles.header}>
          <div style={styles.brand}>🌿</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Start your fitness journey today</p>
        </div>

        <form onSubmit={handleSignup}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email address"
              style={styles.input}
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button} className="auth-btn">
            Sign Up
          </button>
        </form>

        <div style={styles.dividerContainer}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <hr style={styles.dividerLine} />
        </div>

        <button style={styles.googleButton} className="google-btn">
          <GoogleIcon />
          Sign up with Google
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.linkStyle} className="auth-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
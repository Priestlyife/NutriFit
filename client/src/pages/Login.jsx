import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GoogleIcon from "../components/GoogleIcon";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
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
    error: {
      background: "#fef2f2",
      color: "#ef4444",
      padding: "12px",
      borderRadius: "10px",
      fontSize: "14px",
      textAlign: "center",
      marginBottom: "20px",
      border: "1px solid #fecaca",
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
    forgotPassword: {
      textAlign: "right",
      marginTop: "12px",
    },
    linkStyle: {
      color: "#2e7d32",
      fontSize: "14px",
      fontWeight: "500",
      textDecoration: "none",
      transition: "color 0.2s ease",
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
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to continue to NutriFit</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
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
            Sign In
          </button>
        </form>

        <div style={styles.forgotPassword}>
          <Link to="/forgot-password" style={styles.linkStyle} className="auth-link">
            Forgot password?
          </Link>
        </div>

        <div style={styles.dividerContainer}>
          <hr style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <hr style={styles.dividerLine} />
        </div>

        <button style={styles.googleButton} className="google-btn">
          <GoogleIcon />
          Continue with Google
        </button>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.linkStyle} className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)"
    }}>
      <div className="glass-card" style={{
        width: "400px",
        padding: "40px"
      }}>
        <h2 style={{
          color: "#1b5e20",
          marginBottom: "20px",
          fontSize: "26px"
        }}>
          Reset Password
        </h2>

        {!submitted ? (
          <>
            <p style={{ fontSize: "14px", marginBottom: "15px" }}>
              Enter your email address and we’ll send you a password reset link.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                required
              />

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", marginTop: "10px" }}
              >
                Send Reset Link
              </button>
            </form>
          </>
        ) : (
          <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
            <p>
              If an account with that email exists, a reset link has been sent.
            </p>
            <p style={{ marginTop: "10px" }}>
              Please check your inbox.
            </p>
          </div>
        )}

        <p style={{
          marginTop: "20px",
          fontSize: "14px",
          textAlign: "center"
        }}>
          <Link to="/login" style={{ color: "#2e7d32", fontWeight: "500" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;

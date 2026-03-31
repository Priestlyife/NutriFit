import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  const styles = {
    container: {
      position: "relative",
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
      overflow: "hidden",
      fontFamily: "Arial, Helvetica, sans-serif",
      margin: 0,
      padding: 0,
    },
    bgShape1: {
      position: "absolute",
      width: "350px",
      height: "350px",
      background: "#66bb6a",
      borderRadius: "50%",
      filter: "blur(80px)",
      opacity: 0.25,
      top: "-100px",
      right: "-100px",
      animation: "float 8s ease-in-out infinite alternate",
      zIndex: 1,
      pointerEvents: "none",
    },
    bgShape2: {
      position: "absolute",
      width: "450px",
      height: "450px",
      background: "#66bb6a",
      borderRadius: "50%",
      filter: "blur(80px)",
      opacity: 0.15,
      bottom: "-150px",
      left: "-150px",
      animation: "float 8s ease-in-out infinite alternate",
      animationDelay: "-2s",
      zIndex: 1,
      pointerEvents: "none",
    },
    content: {
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
    },
    logoWrapper: {
      width: "90px",
      height: "90px",
      background: "#2e7d32",
      borderRadius: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 12px 35px rgba(46, 125, 50, 0.3)",
      marginBottom: "24px",
      animation: "float 4s ease-in-out infinite",
    },
    logoIcon: {
      fontSize: "46px",
      color: "white",
    },
    title: {
      fontSize: "42px",
      fontWeight: 800,
      color: "#1b5e20",
      margin: "0 0 12px 0",
      letterSpacing: "-1px",
    },
    tagline: {
      fontSize: "18px",
      color: "#444",
      margin: "0 0 40px 0",
      maxWidth: "280px",
      lineHeight: 1.5,
      fontWeight: 500,
    },
    button: {
      background: "#2e7d32",
      color: "white",
      border: "none",
      padding: "16px 36px",
      borderRadius: "50px",
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      boxShadow: "0 8px 20px rgba(46, 125, 50, 0.25)",
    }
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          
          .splash-btn {
            transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          
          .splash-btn:hover {
            background: #1b5e20 !important;
            transform: translateY(-3px);
            box-shadow: 0 12px 25px rgba(46, 125, 50, 0.35) !important;
          }
          
          .splash-btn:active {
            transform: translateY(0px);
          }
          
          .arrow-icon {
            transition: transform 0.3s ease;
          }
          
          .splash-btn:hover .arrow-icon {
            transform: translateX(4px);
          }
          
          @media (max-width: 480px) {
            .responsive-title { font-size: 36px !important; }
            .responsive-tagline { font-size: 16px !important; max-width: 240px !important; }
            .responsive-logo { width: 80px !important; height: 80px !important; margin-bottom: 20px !important; }
            .responsive-icon { font-size: 40px !important; }
            .splash-btn { padding: 14px 32px !important; font-size: 15px !important; }
          }
        `}
      </style>

      <div style={styles.bgShape1}></div>
      <div style={styles.bgShape2}></div>

      <div style={styles.content}>
        <div style={styles.logoWrapper} className="responsive-logo">
          <span style={styles.logoIcon} className="responsive-icon">🌿</span>
        </div>

        <h1 style={styles.title} className="responsive-title">NutriFit</h1>
        
        <p style={styles.tagline} className="responsive-tagline">
          Adaptive AI Nutrition & Fitness
        </p>

        <button 
          style={styles.button} 
          className="splash-btn" 
          onClick={handleGetStarted}
        >
          Get Started
          <svg 
            className="arrow-icon" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Splash;
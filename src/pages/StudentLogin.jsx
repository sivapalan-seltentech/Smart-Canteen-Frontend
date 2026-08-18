import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!studentId.trim() || !password.trim()) {
      setError("Please enter Student ID and Password.");
      return;
    }

    try {
      setLoading(true);
      const result = await login(studentId.trim(), password);

      if (String(result?.user?.role || "").toUpperCase() !== "STUDENT") {
        throw new Error("This account is not a STUDENT account.");
      }

      navigate(location.state?.from || "/student-dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-login-page">
      <section className="student-login-container">
        <div className="student-login-card">
          <div className="student-login-icon">🎓</div>

          <span className="student-login-badge">STUDENT LOGIN</span>

          <h1>
            Welcome to <span>Smart Canteen</span>
          </h1>

          <p className="student-login-description">
            Login with your registered student account to continue.
          </p>

          {error && <div className="login-error">⚠️ {error}</div>}

          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label htmlFor="studentLoginId">Student ID</label>
              <input
                id="studentLoginId"
                type="text"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="studentPassword">Password</label>
              <input
                id="studentPassword"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="student-login-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login & Continue →"}
            </button>
          </form>

          <Link to="/login" className="login-back-cart">
            ← Common Login
          </Link>
        </div>
      </section>
    </div>
  );
}

export default StudentLogin;

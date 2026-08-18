import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function dashboardForRole(role) {
  const value = String(role || "").toUpperCase();
  if (value === "ADMIN") return "/admin-dashboard";
  if (value === "EMPLOYEE") return "/employee-dashboard";
  return "/student-dashboard";
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your username, email or Student ID and password.");
      return;
    }

    try {
      setLoading(true);
      const result = await login(identifier.trim(), password);
      const role = result?.user?.role;
      const destination = dashboardForRole(role);

      // Role is decided by the backend JWT/user response.
      const requested = location.state?.from;
      if (requested && requested !== "/login") {
        navigate(requested, { replace: true });
      } else {
        navigate(destination, { replace: true });
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-badge">🎓 Smart Canteen Login</span>
          <h1>Welcome <span>Back</span></h1>
          <p>Login to your Smart Canteen account.</p>
        </div>

        {error && <div className="login-error">⚠️ {error}</div>}

        <form onSubmit={handleLogin}>
          <div className="login-form-group">
            <label htmlFor="identifier">Username / Email / Student ID</label>
            <input
              id="identifier"
              type="text"
              placeholder="Enter username, email or Student ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>

        <div className="login-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;

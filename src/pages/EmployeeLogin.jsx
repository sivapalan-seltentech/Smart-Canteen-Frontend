import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function EmployeeLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      setLoading(true);
      const result = await login(identifier.trim(), password);
      if (String(result?.user?.role).toUpperCase() !== "EMPLOYEE") {
        throw new Error("This account is not an EMPLOYEE account.");
      }
      nav("/employee-dashboard", { replace: true });
    } catch (error) {
      setErr(error.message || "Invalid employee credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <span className="admin-badge">👨‍🍳 Employee Login</span>
        <h1>Staff <span>Portal</span></h1>
        <p>Process student orders and update their tracking status.</p>
        {err && <div className="admin-error">{err}</div>}
        <form onSubmit={submit}>
          <label>
            Username / Email
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </label>
          <button className="admin-primary-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login →"}
          </button>
        </form>
        <Link to="/admin-login">Admin Login</Link>
        <br />
        <Link to="/login">Student / Common Login</Link>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const result = await login(identifier.trim(), password);
      if (String(result?.user?.role).toUpperCase() !== "ADMIN") {
        await Promise.resolve();
        throw new Error("This account is not an ADMIN account.");
      }
      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid admin credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <span className="admin-badge">👨‍💼 Admin Login</span>
        <h1>Smart Canteen <span>Admin</span></h1>
        <p>Manage menu, students, employees and orders.</p>
        {error && <div className="admin-error">{error}</div>}
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
        <Link to="/login">Student / Common Login</Link>
      </div>
    </div>
  );
}

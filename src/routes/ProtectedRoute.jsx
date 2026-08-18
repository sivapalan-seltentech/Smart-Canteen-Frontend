import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const role = String(user.role || "").toUpperCase();

  if (roles?.length && !roles.map(String).map((r) => r.toUpperCase()).includes(role)) {
    const destination =
      role === "ADMIN" ? "/admin-dashboard" :
      role === "EMPLOYEE" ? "/employee-dashboard" :
      "/student-dashboard";

    return <Navigate to={destination} replace />;
  }

  return children;
}

export default ProtectedRoute;

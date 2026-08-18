import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart = [] } = useCart();
  const { user, logout } = useAuth();

  const [showProfile, setShowProfile] = useState(false);

  const closeProfile = () => {
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((value) => !value);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setShowProfile(false);
      navigate("/login", { replace: true });
    }
  };

  const role = String(user?.role || "").toUpperCase();

  const isAdmin = role === "ADMIN";
  const isEmployee = role === "EMPLOYEE";
  const isStudent = role === "STUDENT";

  const dashboardPath = isAdmin
    ? "/admin-dashboard"
    : isEmployee
      ? "/employee-dashboard"
      : "/student-dashboard";

  // =========================================================
  // ADMIN / EMPLOYEE HEADER
  // =========================================================

  if (isAdmin || isEmployee) {
    return (
      <header className="header staff-header">
        <div className="header-container">

          {/* LOGO */}
          <Link
            to={dashboardPath}
            className="logo"
            onClick={closeProfile}
          >
            <div className="logo-icon">
              🍔
            </div>

            <span>Smart Canteen</span>
          </Link>

          {/* STAFF NAVIGATION */}
          <nav className="nav staff-nav">

            {/* DASHBOARD */}
            <Link
              to={dashboardPath}
              state={
                isAdmin
                  ? { tab: "overview" }
                  : undefined
              }
              onClick={closeProfile}
            >
              Dashboard
            </Link>

            {/* ADMIN */}
            {isAdmin && (
              <>
                <Link
                  to="/admin-dashboard"
                  state={{ tab: "menu" }}
                  onClick={closeProfile}
                >
                  Menu
                </Link>

                <Link
                  to="/admin-dashboard"
                  state={{ tab: "students" }}
                  onClick={closeProfile}
                >
                  Users
                </Link>

                <Link
                  to="/admin-dashboard"
                  state={{ tab: "orders" }}
                  onClick={closeProfile}
                >
                  Orders
                </Link>
              </>
            )}

            {/* EMPLOYEE */}
            {isEmployee && (
              <>
                <Link
                  to="/menu"
                  onClick={closeProfile}
                >
                  Menu
                </Link>

                <Link
                  to="/employee-dashboard"
                  onClick={closeProfile}
                >
                  Orders
                </Link>
              </>
            )}

            {/* STAFF PROFILE */}
            <div className="profile-wrapper">

              <button
                type="button"
                className="profile-button"
                onClick={toggleProfile}
              >
                <div className="profile-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <span>
                  {user?.name || "User"}
                </span>

                <span className="profile-arrow">
                  {showProfile ? "▲" : "▼"}
                </span>
              </button>

              {showProfile && (
                <div className="profile-dropdown staff-profile-dropdown">

                  {/* PROFILE HEADER */}
                  <div className="profile-dropdown-header">

                    <div className="profile-big-avatar">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div>
                      <strong>
                        {user?.name || "User"}
                      </strong>

                      <small>
                        {role}
                      </small>
                    </div>

                  </div>

                  {/* ADMIN DETAILS */}
                  {isAdmin && (
                    <div className="profile-details">

                      <div className="profile-detail">
                        <span>Username</span>
                        <strong>
                          {user?.username || "-"}
                        </strong>
                      </div>

                      <div className="profile-detail">
                        <span>Email</span>
                        <strong>
                          {user?.email || "-"}
                        </strong>
                      </div>

                    </div>
                  )}

                  {/* EMPLOYEE DETAILS */}
                  {isEmployee && (
                    <div className="profile-details">

                      <div className="profile-detail">
                        <span>Employee ID</span>
                        <strong>
                          {user?.employeeId || "-"}
                        </strong>
                      </div>

                      <div className="profile-detail">
                        <span>Username</span>
                        <strong>
                          {user?.username || "-"}
                        </strong>
                      </div>

                      <div className="profile-detail">
                        <span>Email</span>
                        <strong>
                          {user?.email || "-"}
                        </strong>
                      </div>

                    </div>
                  )}

                  {/* DASHBOARD */}
                  <Link
                    to={dashboardPath}
                    state={
                      isAdmin
                        ? { tab: "overview" }
                        : undefined
                    }
                    className="profile-dashboard-btn"
                    onClick={closeProfile}
                  >
                    📊 Dashboard
                  </Link>

                  {/* ADMIN LINKS */}
                  {isAdmin && (
                    <>
                      <Link
                        to="/admin-dashboard"
                        state={{ tab: "menu" }}
                        className="profile-orders-btn"
                        onClick={closeProfile}
                      >
                        🍔 Menu Management
                      </Link>

                      <Link
                        to="/admin-dashboard"
                        state={{ tab: "students" }}
                        className="profile-orders-btn"
                        onClick={closeProfile}
                      >
                        🎓 Student Management
                      </Link>

                      <Link
                        to="/admin-dashboard"
                        state={{ tab: "employees" }}
                        className="profile-orders-btn"
                        onClick={closeProfile}
                      >
                        👨‍🍳 Employee Management
                      </Link>

                      <Link
                        to="/admin-dashboard"
                        state={{ tab: "orders" }}
                        className="profile-orders-btn"
                        onClick={closeProfile}
                      >
                        📦 Order Management
                      </Link>
                    </>
                  )}

                  {/* LOGOUT */}
                  <button
                    type="button"
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    ↪ Logout
                  </button>

                </div>
              )}

            </div>
          </nav>
        </div>
      </header>
    );
  }

  // =========================================================
  // STUDENT / PUBLIC HEADER
  // =========================================================

  return (
    <header className="header">

      <div className="header-container">

        {/* LOGO */}
        <Link
          to={isStudent ? "/student-dashboard" : "/"}
          className="logo"
          onClick={closeProfile}
        >
          <div className="logo-icon">
            🍔
          </div>

          <span>
            Smart Canteen
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="nav">

          <Link
            to="/"
            onClick={closeProfile}
          >
            Home
          </Link>

          <Link
            to="/menu"
            onClick={closeProfile}
          >
            Menu
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            onClick={closeProfile}
          >
            🛒 Cart

            {cart.length > 0 && (
              <span className="cart-count">
                {cart.length}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {/* ORDERS */}
              <Link
                to="/my-orders"
                onClick={closeProfile}
              >
                Orders
              </Link>

              {/* TRACKING */}
              <Link
                to="/order-tracking"
                onClick={closeProfile}
              >
                Tracking
              </Link>

              {/* =================================================
                  STUDENT PROFILE
              ================================================= */}

              <div className="profile-wrapper">

                <button
                  type="button"
                  className="profile-button"
                  onClick={toggleProfile}
                >

                  <div className="profile-avatar">
                    {user?.name?.charAt(0).toUpperCase() || "S"}
                  </div>

                  <span>
                    {user?.name || "Student"}
                  </span>

                  <span className="profile-arrow">
                    {showProfile ? "▲" : "▼"}
                  </span>

                </button>

                {showProfile && (
                  <div className="profile-dropdown">

                    {/* PROFILE HEADER */}
                    <div className="profile-dropdown-header">

                      <div className="profile-big-avatar">
                        {user?.name?.charAt(0).toUpperCase() || "S"}
                      </div>

                      <div>

                        <strong>
                          {user?.name || "Student"}
                        </strong>

                        <small>
                          {user?.role || "STUDENT"}
                        </small>

                      </div>

                    </div>

                    {/* =================================================
                        STUDENT DETAILS
                    ================================================= */}

                    <div className="profile-details">

                      <div className="profile-detail">
                        <span>
                          Student ID
                        </span>

                        <strong>
                          {user?.studentId || "-"}
                        </strong>
                      </div>

                      <div className="profile-detail">
                        <span>
                          Email
                        </span>

                        <strong>
                          {user?.email || "-"}
                        </strong>
                      </div>

                      <div className="profile-detail">
                        <span>
                          Phone
                        </span>

                        <strong>
                          {user?.phone || "-"}
                        </strong>
                      </div>

                      <div className="profile-detail">
                        <span>
                          Department
                        </span>

                        <strong>
                          {user?.department || "-"}
                        </strong>
                      </div>

                      <div className="profile-detail">
                        <span>
                          Year
                        </span>

                        <strong>
                          {user?.year || "-"}
                        </strong>
                      </div>

                    </div>

                    {/* =================================================
                        STUDENT QUICK ACTIONS
                    ================================================= */}

                    <Link
                      to="/student-dashboard"
                      className="profile-dashboard-btn"
                      onClick={closeProfile}
                    >
                      🎓 Student Dashboard
                    </Link>

                    <Link
                      to="/menu"
                      className="profile-orders-btn"
                      onClick={closeProfile}
                    >
                      🍔 Browse Menu
                    </Link>

                    <Link
                      to="/cart"
                      className="profile-orders-btn"
                      onClick={closeProfile}
                    >
                      🛒 My Cart
                    </Link>

                    <Link
                      to="/my-orders"
                      className="profile-orders-btn"
                      onClick={closeProfile}
                    >
                      📦 My Orders
                    </Link>

                    <Link
                      to="/order-tracking"
                      className="profile-orders-btn"
                      onClick={closeProfile}
                    >
                      🚚 Track Order
                    </Link>

                    {/* LOGOUT */}
                    <button
                      type="button"
                      className="logout-btn"
                      onClick={handleLogout}
                    >
                      ↪ Logout
                    </button>

                  </div>
                )}

              </div>
            </>
          ) : (
            <>
              {/* LOGIN */}
              <Link
                to="/login"
                className="login-nav-btn"
                onClick={closeProfile}
              >
                Login
              </Link>

              {/* REGISTER */}
              <Link
                to="/register"
                className="register-nav-btn"
                onClick={closeProfile}
              >
                Register
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}

export default Header;
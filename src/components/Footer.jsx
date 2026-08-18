import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { user } = useAuth();

  const role = String(user?.role || "").toUpperCase();

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* ================================================= */}
        {/* BRAND */}
        {/* ================================================= */}

        <div className="footer-brand">

          <Link
            to={
              role === "ADMIN"
                ? "/admin-dashboard"
                : role === "EMPLOYEE"
                  ? "/employee-dashboard"
                  : role === "STUDENT"
                    ? "/student-dashboard"
                    : "/"
            }
            className="footer-logo"
          >
            <span>🍔</span>

            <strong>
              Smart Canteen
            </strong>
          </Link>

          <p>
            Smart ordering. Less waiting. Better experience.
          </p>

        </div>

        {/* ================================================= */}
        {/* QUICK LINKS */}
        {/* ================================================= */}

        <div className="footer-links">

          <h4>
            Quick Links
          </h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/menu">
            Menu
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          {user && (
            <>
              <Link to="/my-orders">
                My Orders
              </Link>

              <Link to="/order-tracking">
                Track Order
              </Link>
            </>
          )}

        </div>

        {/* ================================================= */}
        {/* ACCOUNT */}
        {/* ================================================= */}

        <div className="footer-links">

          <h4>
            Account
          </h4>

          {!user ? (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Register
              </Link>
            </>
          ) : (
            <>
              {role === "STUDENT" && (
                <Link to="/student-dashboard">
                  Student Dashboard
                </Link>
              )}

              {role === "ADMIN" && (
                <Link to="/admin-dashboard">
                  Admin Dashboard
                </Link>
              )}

              {role === "EMPLOYEE" && (
                <Link to="/employee-dashboard">
                  Employee Dashboard
                </Link>
              )}
            </>
          )}

        </div>

        <div className="footer-divider"></div>

        {/* ================================================= */}
        {/* COPYRIGHT */}
        {/* ================================================= */}

        <div className="footer-bottom">

          <p>
            © 2026 Smart Canteen. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
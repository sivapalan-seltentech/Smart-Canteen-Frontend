import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import { CartProvider } from "./context/CartContext";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import MyOrders from "./pages/MyOrders";
import OrderTracking from "./pages/OrderTracking";
import OrderConfirmation from "./pages/OrderConfirmation";

import StudentDashboard from "./pages/StudentDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeLogin from "./pages/EmployeeLogin";
import StudentProfile from "./pages/StudentProfile";


// ======================================================
// AUTH PROTECTION
// ======================================================

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// ======================================================
// ADMIN PROTECTION
// ======================================================

function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  const role = String(user.role || "").toUpperCase();

  if (role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}


// ======================================================
// EMPLOYEE PROTECTION
// ======================================================

function EmployeeRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/employee-login" replace />;
  }

  const role = String(user.role || "").toUpperCase();

  if (role !== "EMPLOYEE") {
    return <Navigate to="/" replace />;
  }

  return children;
}


// ======================================================
// MAIN STUDENT LAYOUT
// ======================================================

function MainLayout() {
  return (
    <div className="app">

      <Header />

      <main className="app-content">

        <Routes>

          {/* ============================================
              PUBLIC
          ============================================ */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/menu"
            element={<Menu />}
          />


          {/* ============================================
              STUDENT
          ============================================ */}

          <Route
            path="/student-dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-tracking"
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
           <Route
           path="/student-profile"
           element={<StudentProfile />}
           />

          {/* ============================================
              ADMIN
              Completely separate access
          ============================================ */}

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />


          {/* ============================================
              EMPLOYEE
              Completely separate access
          ============================================ */}

          <Route
            path="/employee-login"
            element={<EmployeeLogin />}
          />

          <Route
            path="/employee-dashboard"
            element={
              <EmployeeRoute>
                <EmployeeDashboard />
              </EmployeeRoute>
            }
          />


          {/* ============================================
              FALLBACK
          ============================================ */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </main>

      <Footer />

    </div>
  );
}


// ======================================================
// APP CONTENT
// ======================================================

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return <MainLayout />;
}


// ======================================================
// APP
// ======================================================

export default function App() {
  return (
    <AuthProvider>

      <CartProvider>

        <BrowserRouter>

          <AppContent />

        </BrowserRouter>

      </CartProvider>

    </AuthProvider>
  );
}
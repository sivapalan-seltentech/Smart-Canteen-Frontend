import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function StudentDashboard() {
  const { user: authUser, loading: authLoading } =
    useAuth();

  const [student, setStudent] = useState(null);
  const [currentOrder, setCurrentOrder] =
    useState(null);

  // =====================================================
  // LOAD STUDENT + ORDER DATA
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      const user = authUser;

      console.log(
        "STUDENT DASHBOARD USER:",
        user
      );

      /*
       * IMPORTANT:
       * Set logged-in user into student state.
       */
      setStudent(user || null);

      if (!user?.id) {
        setCurrentOrder(null);
        return;
      }

      try {
        const orders =
          await api.getOrdersByUser(user.id);

        const active = (
          Array.isArray(orders)
            ? orders
            : []
        ).find(
          (order) =>
            ![
              "COMPLETED",
              "CANCELLED",
            ].includes(
              String(
                order?.status || ""
              ).toUpperCase()
            )
        );

        setCurrentOrder(
          active || null
        );
      } catch (error) {
        console.error(
          "Student dashboard order error:",
          error
        );

        setCurrentOrder(null);
      }
    };

    if (!authLoading) {
      loadData();
    }
  }, [authUser, authLoading]);

  // =====================================================
  // STUDENT DATA
  // =====================================================

  const studentName =
    student?.name || "Student";

  /*
   * Support both camelCase and snake_case
   * in case backend response changes.
   */
  const studentId =
    student?.studentId ||
    student?.student_id ||
    "-";

  const department =
    student?.department ||
    student?.dept ||
    "-";

  const year =
    student?.year ||
    student?.yearOfStudy ||
    "-";

  const email =
    student?.email ||
    "-";

  // =====================================================
  // LOADING
  // =====================================================

  if (authLoading) {
    return (
      <div className="student-dashboard">
        <section className="student-dashboard-hero">
          <h1>Loading student details...</h1>
        </section>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="student-dashboard">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="student-dashboard-hero">

        <div>

          <span className="dashboard-badge">
            👨‍🎓 Student Dashboard
          </span>

          <h1>
            Welcome,{" "}
            <span>
              {studentName}
            </span>
          </h1>

          <p>
            Manage your canteen orders
            and track your food easily.
          </p>

        </div>

        <div className="student-profile-card">

          <div className="student-avatar">
            {studentName
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <h3>
              {studentName}
            </h3>

            <p>
              {studentId}
            </p>

          </div>

        </div>

      </section>

      {/* =================================================
          STUDENT INFORMATION
      ================================================= */}

      <section className="student-info-section">

        <div className="student-info-card">

          <div className="student-info-item">

            <span>
              Student ID
            </span>

            <strong>
              {studentId}
            </strong>

          </div>

          <div className="student-info-item">

            <span>
              Department
            </span>

            <strong>
              {department}
            </strong>

          </div>

          <div className="student-info-item">

            <span>
              Year
            </span>

            <strong>
              {year}
            </strong>

          </div>

          <div className="student-info-item">

            <span>
              Email
            </span>

            <strong>
              {email}
            </strong>

          </div>

        </div>

      </section>

      {/* =================================================
          CURRENT ORDER
      ================================================= */}

      {currentOrder && (
        <section className="student-current-order-section">

          <div className="student-current-order-card">

            <div>

              <span>
                CURRENT ORDER
              </span>

              <h2>
                {currentOrder.tokenNumber}
              </h2>

              <p>
                {currentOrder.items?.length || 0}
                {" "}item(s)
                {" • "}
                ₹
                {Number(
                  currentOrder.totalAmount || 0
                ).toFixed(2)}
              </p>

            </div>

            <div
              className={`dashboard-order-status status-${String(
                currentOrder.status || ""
              ).toLowerCase()}`}
            >
              {currentOrder.status}
            </div>

            <Link
              to="/order-tracking"
              state={{
                orderId: currentOrder.id,
              }}
              className="dashboard-track-btn"
            >
              Track Order →
            </Link>

          </div>

        </section>
      )}

      {/* =================================================
          QUICK ACTIONS
      ================================================= */}

      <section className="student-dashboard-section">

        <div className="dashboard-section-heading">

          <span>
            QUICK ACTIONS
          </span>

          <h2>
            What would you like to do?
          </h2>

        </div>

        <div className="student-dashboard-grid">

          {/* MENU */}

          <Link
            to="/menu"
            className="student-dashboard-card"
          >

            <div className="student-dashboard-icon">
              🍔
            </div>

            <h3>
              Browse Menu
            </h3>

            <p>
              Explore available food items
              and place a new order.
            </p>

            <span>
              Order Food →
            </span>

          </Link>

          {/* ORDERS */}

          <Link
            to="/my-orders"
            className="student-dashboard-card"
          >

            <div className="student-dashboard-icon">
              📦
            </div>

            <h3>
              My Orders
            </h3>

            <p>
              View previous and current
              canteen orders.
            </p>

            <span>
              View Orders →
            </span>

          </Link>

          {/* TRACK */}

          <Link
            to="/order-tracking"
            className="student-dashboard-card"
          >

            <div className="student-dashboard-icon">
              🚚
            </div>

            <h3>
              Track Order
            </h3>

            <p>
              See Pending, Preparing,
              Ready and Completed status.
            </p>

            <span>
              Track Now →
            </span>

          </Link>

 {/* PROFILE */}
<Link
  to="/student-profile"
  className="student-dashboard-card profile-action-card"
>
  <div className="student-dashboard-icon">
    👤
  </div>

  <h3>My Profile</h3>

  <p>
    Registered student details are shown
    above and in the navbar profile.
  </p>

  <span>
    View Profile →
  </span>
</Link>

        </div>

      </section>

    </div>
  );
}

export default StudentDashboard;
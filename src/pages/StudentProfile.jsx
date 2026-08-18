import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function StudentProfile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="student-profile-page">
        <div className="student-profile-loading">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="student-profile-page">
        <div className="student-profile-empty">
          <h2>Student not logged in</h2>

          <Link to="/login" className="profile-back-btn">
            Login →
          </Link>
        </div>
      </div>
    );
  }

  const studentName = user?.name || "Student";

  const studentId =
    user?.studentId ||
    user?.student_id ||
    "-";

  const department =
    user?.department ||
    user?.dept ||
    "-";

  const year =
    user?.year ||
    user?.yearOfStudy ||
    "-";

  const email =
    user?.email ||
    "-";

  const phone =
    user?.phone ||
    "-";

  const username =
    user?.username ||
    "-";

  return (
    <div className="student-profile-page">

      {/* =====================================================
          PROFILE HERO
      ===================================================== */}

      <section className="student-profile-hero">

        <div className="student-profile-heading">

          <span className="dashboard-badge">
            👤 MY PROFILE
          </span>

          <h1>
            Student <span>Profile</span>
          </h1>

          <p>
            View your registered student information
            and account details.
          </p>

        </div>

        <div className="student-profile-avatar-large">
          {studentName
            .charAt(0)
            .toUpperCase()}
        </div>

      </section>


      {/* =====================================================
          PROFILE CARD
      ===================================================== */}

      <section className="student-profile-content">

        <div className="student-profile-main-card">

          {/* PROFILE HEADER */}

          <div className="student-profile-card-header">

            <div className="student-profile-avatar">
              {studentName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>

              <h2>
                {studentName}
              </h2>

              <p>
                {studentId}
              </p>

              <span className="student-profile-role">
                STUDENT
              </span>

            </div>

          </div>


          {/* =================================================
              DETAILS
          ================================================= */}

          <div className="student-profile-details">

            <div className="student-profile-detail">

              <span>
                👨‍🎓 Student Name
              </span>

              <strong>
                {studentName}
              </strong>

            </div>


            <div className="student-profile-detail">

              <span>
                🪪 Student ID
              </span>

              <strong>
                {studentId}
              </strong>

            </div>


            <div className="student-profile-detail">

              <span>
                📧 Email
              </span>

              <strong>
                {email}
              </strong>

            </div>


            <div className="student-profile-detail">

              <span>
                📱 Phone
              </span>

              <strong>
                {phone}
              </strong>

            </div>


            <div className="student-profile-detail">

              <span>
                🏫 Department
              </span>

              <strong>
                {department}
              </strong>

            </div>


            <div className="student-profile-detail">

              <span>
                📚 Year of Study
              </span>

              <strong>
                {year}
              </strong>

            </div>


            <div className="student-profile-detail">

              <span>
                🔐 Username
              </span>

              <strong>
                {username}
              </strong>

            </div>


            <div className="student-profile-detail">

              <span>
                👤 Role
              </span>

              <strong>
                {user?.role || "STUDENT"}
              </strong>

            </div>

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="student-profile-actions">

            <Link
              to="/student-dashboard"
              className="profile-back-btn"
            >
              ← Back to Dashboard
            </Link>

            <Link
              to="/menu"
              className="profile-menu-btn"
            >
              🍔 Browse Menu
            </Link>

            <Link
              to="/my-orders"
              className="profile-orders-btn"
            >
              📦 My Orders
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default StudentProfile;
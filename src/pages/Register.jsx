
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../utils/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* =========================================
     HANDLE INPUT CHANGE
  ========================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  /* =========================================
     HANDLE REGISTER
  ========================================= */

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");

    const {
      name,
      studentId,
      email,
      phone,
      department,
      year,
      password,
      confirmPassword,
    } = formData;

    /* =========================================
       VALIDATION
    ========================================= */

    if (
      !name.trim() ||
      !studentId.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !department ||
      !year ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill all the details.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const registeredUser = {
        name: name.trim(),
        username: studentId.trim(),
        studentId: studentId.trim(),
        email: email.trim(),
        phone: phone.trim(),
        department,
        year,
        password,
        role: "STUDENT",
      };

      await api.register(registeredUser);

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="register-header">

          <span className="register-badge">
            🎓 Student Registration
          </span>

          <h1>
            Create Your <span>Account</span>
          </h1>

          <p>
            Register to order food and manage your
            canteen orders.
          </p>

        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="register-error">
            ⚠️ {error}
          </div>
        )}


        {/* =====================================
            FORM
        ===================================== */}

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          <div className="register-form-grid">

            {/* NAME */}

            <div className="register-form-group">

              <label htmlFor="name">
                Student Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>


            {/* STUDENT ID */}

            <div className="register-form-group">

              <label htmlFor="studentId">
                Student ID
              </label>

              <input
                id="studentId"
                type="text"
                name="studentId"
                placeholder="Example: STU001"
                value={formData.studentId}
                onChange={handleChange}
              />

            </div>


            {/* EMAIL */}

            <div className="register-form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            {/* PHONE */}

            <div className="register-form-group">

              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>


            {/* DEPARTMENT */}

            <div className="register-form-group">

              <label htmlFor="department">
                Department
              </label>

              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              >

                <option value="">
                  Select Department
                </option>

                <option value="Information Technology">
                  Information Technology
                </option>

                <option value="Computer Science Engineering">
                  Computer Science Engineering
                </option>

                <option value="Electronics and Communication Engineering">
                  Electronics and Communication Engineering
                </option>

                <option value="Electrical and Electronics Engineering">
                  Electrical and Electronics Engineering
                </option>

                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>

                <option value="Civil Engineering">
                  Civil Engineering
                </option>

              </select>

            </div>


            {/* YEAR */}

            <div className="register-form-group">

              <label htmlFor="year">
                Year
              </label>

              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >

                <option value="">
                  Select Year
                </option>

                <option value="1st Year">
                  1st Year
                </option>

                <option value="2nd Year">
                  2nd Year
                </option>

                <option value="3rd Year">
                  3rd Year
                </option>

                <option value="4th Year">
                  4th Year
                </option>

              </select>

            </div>


            {/* PASSWORD */}

            <div className="register-form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="register-password-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="register-form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="register-password-wrapper">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>

          </div>


          {/* =====================================
              SUBMIT
          ===================================== */}

          <button
            type="submit"
            className="register-submit-btn"
          >
            Create Account →
          </button>

        </form>


        {/* =====================================
            FOOTER
        ===================================== */}

        <div className="register-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;


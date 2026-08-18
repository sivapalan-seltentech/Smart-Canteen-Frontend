import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../context/CartContext";

import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";


function Checkout() {

  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();


  // ==========================================
  // USER
  // ==========================================

  const [loggedInStudent, setLoggedInStudent] =
    useState(null);


  const [studentName, setStudentName] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [year, setYear] =
    useState("");


  const [placingOrder, setPlacingOrder] =
    useState(false);


  // ==========================================
  // LOAD USER
  // ==========================================

  useEffect(() => {
    if (!user) {
      setLoggedInStudent(null);
      return;
    }

    setLoggedInStudent(user);
    setStudentName(user.name || "");
    setStudentId(user.studentId || "");
    setDepartment(user.department || "");
    setYear(user.year || "");
  }, [user]);

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  useEffect(() => {
    if (cart.length > 0 && !user) {
      navigate("/login", {
        state: { from: "/checkout" },
        replace: true,
      });
    }
  }, [cart.length, user, navigate]);

  const tax =
    cartTotal * 0.05;

  const total =
    cartTotal + tax;


  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {

    return (
      <div className="checkout-page">

        <section className="checkout-hero">

          <span className="checkout-badge">
            🧾 Checkout
          </span>

          <h1>
            Your Cart is{" "}
            <span>Empty</span>
          </h1>

          <p>
            Add some food items from the
            menu before proceeding to checkout.
          </p>

        </section>


        <section className="checkout-section">

          <div className="empty-checkout">

            <div className="empty-checkout-icon">
              🛒
            </div>

            <h2>
              No Items to Checkout
            </h2>

            <p>
              Please add food items to
              your cart first.
            </p>

            <Link
              to="/menu"
              className="browse-menu-btn"
            >
              Browse Menu
            </Link>

          </div>

        </section>

      </div>
    );
  }


  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (!studentName.trim() || !studentId.trim() || !department || !year) {
      alert("Please fill all student details.");
      return;
    }

    try {
      setPlacingOrder(true);

      // Spring Boot reads the current user's cart from MySQL.
      const savedOrder = await api.placeOrder(user.id);

      if (!savedOrder?.id) {
        throw new Error("Order was not created. Make sure your cart is not empty.");
      }

      const subtotal = Number(savedOrder.totalAmount || 0);

      const confirmationOrder = {
        id: savedOrder.id,
        token: savedOrder.tokenNumber,
        studentName: studentName.trim(),
        studentId: studentId.trim(),
        email: user.email || "",
        phone: user.phone || "",
        department,
        year,
        items: savedOrder.items || [],
        subtotal,
        tax: subtotal * 0.05,
        total: subtotal * 1.05,
        pickupLocation: "Main Canteen",
        status: savedOrder.status,
        orderDate: savedOrder.orderDate,
      };

      await clearCart();

      navigate("/order-confirmation", {
        state: { order: confirmationOrder },
      });
    } catch (error) {
      console.error("Place order error:", error);
      alert(error.message || "Unable to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page">

      {/* HERO */}

      <section className="checkout-hero">

        <span className="checkout-badge">
          🧾 Checkout
        </span>

        <h1>
          Complete Your{" "}
          <span>Order</span>
        </h1>

        <p>
          Enter your student details and
          confirm your canteen order.
        </p>

      </section>


      <section className="checkout-section">

        <div className="checkout-layout">


          {/* FORM */}

          <form
            className="checkout-form-card"
            onSubmit={handlePlaceOrder}
          >

            <div className="checkout-card-heading">

              <span>
                STUDENT INFORMATION
              </span>

              <h2>
                Student Details
              </h2>

              <p>
                Your registered details are used
                for order identification.
              </p>

            </div>


            {/* NAME */}

            <div className="form-group">

              <label htmlFor="studentName">
                Student Name
              </label>

              <input
                id="studentName"
                type="text"
                placeholder="Enter your full name"
                value={studentName}
                onChange={(e) =>
                  setStudentName(
                    e.target.value
                  )
                }
              />

            </div>


            {/* ID */}

            <div className="form-group">

              <label htmlFor="studentId">
                Student ID
              </label>

              <input
                id="studentId"
                type="text"
                placeholder="Enter your student ID"
                value={studentId}
                onChange={(e) =>
                  setStudentId(
                    e.target.value
                  )
                }
              />

            </div>


            {/* DEPARTMENT */}

            <div className="form-group">

              <label htmlFor="department">
                Department
              </label>

              <select
                id="department"
                value={department}
                onChange={(e) =>
                  setDepartment(
                    e.target.value
                  )
                }
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

            <div className="form-group">

              <label htmlFor="year">
                Year
              </label>

              <select
                id="year"
                value={year}
                onChange={(e) =>
                  setYear(
                    e.target.value
                  )
                }
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


            {/* PICKUP */}

            <div className="pickup-info">

              <div className="pickup-icon">
                🏫
              </div>

              <div>

                <strong>
                  Canteen Pickup
                </strong>

                <p>
                  Collect your order from
                  the Main Canteen.
                </p>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="checkout-form-actions">

              <Link
                to="/cart"
                className="back-cart-btn"
              >
                ← Back to Cart
              </Link>


              <button
                type="submit"
                className="place-order-btn"
                disabled={placingOrder}
              >

                {placingOrder
                  ? "Placing Order..."
                  : "Place Order →"}

              </button>

            </div>

          </form>


          {/* SUMMARY */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>


            <div className="checkout-items">

              {cart.map((item) => (

                <div
                  className="checkout-item"
                  key={item.cartId}
                >

                  <div className="checkout-item-image">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      item.emoji ||
                      "🍽️"
                    )}

                  </div>


                  <div className="checkout-item-info">

                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Qty: {item.quantity}
                    </p>

                  </div>


                  <strong>
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </strong>

                </div>

              ))}

            </div>


            <div className="checkout-divider" />


            <div className="checkout-summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹{cartTotal.toFixed(2)}
              </strong>

            </div>


            <div className="checkout-summary-row">

              <span>
                Tax (5%)
              </span>

              <strong>
                ₹{tax.toFixed(2)}
              </strong>

            </div>


            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toFixed(2)}
              </strong>

            </div>


            <div className="checkout-pickup">

              <span>
                📍
              </span>

              <div>

                <strong>
                  Pickup Location
                </strong>

                <p>
                  Main Canteen
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}


export default Checkout;
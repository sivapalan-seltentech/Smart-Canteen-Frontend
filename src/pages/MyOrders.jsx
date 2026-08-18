import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const getStatusText = (status) => {
  switch (String(status || "").toUpperCase()) {
    case "PLACED":
      return "Pending";
    case "PREPARING":
      return "Preparing";
    case "READY":
      return "Ready";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status || "Pending";
  }
};

const getStatusClass = (status) =>
  `status-${String(status || "PLACED").toLowerCase()}`;

function MyOrders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(
    async (showLoading = false) => {
      if (!user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        if (showLoading) {
          setLoading(true);
        }

        setError("");

        const data = await api.getOrdersByUser(user.id);

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("My Orders error:", err);

        if (showLoading) {
          setError(err.message || "Unable to load orders.");
        }
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [user?.id]
  );

  useEffect(() => {
    loadOrders(true);
  }, [loadOrders]);

  /*
   * Refresh data silently.
   * IMPORTANT:
   * We don't set loading=true here.
   * So the page will NOT blink every few seconds.
   */
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      loadOrders(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [user?.id, loadOrders]);

  if (!user) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <h2>Please login first</h2>

          <Link to="/login" className="dashboard-track-btn">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <section className="orders-hero">
        <span>📦 MY ORDERS</span>

        <h1>
          Your <b>Orders</b>
        </h1>

        <p>
          View your current and previous canteen orders.
        </p>
      </section>

      <section className="orders-section">
        <div className="orders-section-title">
          <span>ORDER HISTORY</span>
          <h2>My Orders</h2>
        </div>

        {loading ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">⏳</div>
            <h3>Loading orders...</h3>
          </div>
        ) : error ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">⚠️</div>
            <h3>{error}</h3>

            <button
              type="button"
              className="dashboard-track-btn"
              onClick={() => loadOrders(true)}
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">📦</div>

            <h3>No orders yet</h3>

            <p>
              You haven't placed any canteen orders.
            </p>

            <Link
              to="/menu"
              className="dashboard-track-btn"
            >
              Browse Menu →
            </Link>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div
                className="order-card"
                key={order.id}
              >
                <div className="order-card-header">
                  <div>
                    <small>ORDER TOKEN</small>

                    <h2>
                      {order.tokenNumber || "N/A"}
                    </h2>
                  </div>

                  <span
                    className={`order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="order-card-info">
                  <div>
                    <span>Date</span>

                    <strong>
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleString()
                        : "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>

                    <strong>
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <div className="order-card-items">
                  {(order.items || []).map(
                    (item, index) => {
                      const food =
                        item.food || {};

                      return (
                        <div
                          key={
                            item.id ||
                            `${order.id}-${index}`
                          }
                        >
                          <span>
                            {food.name || "Food"}
                          </span>

                          <strong>
                            × {item.quantity || 0}
                          </strong>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="order-card-actions">
                  <Link
                    to="/order-tracking"
                    state={{
                      orderId: order.id,
                    }}
                    className="dashboard-track-btn"
                  >
                    Track Order →
                  </Link>

                  <Link
                    to="/order-confirmation"
                    state={{
                      order: {
                        ...order,
                        token:
                          order.tokenNumber,
                        studentName:
                          order.user?.name ||
                          user.name ||
                          "Student",
                        studentId:
                          order.user?.studentId ||
                          user.studentId ||
                          "N/A",
                        total:
                          order.totalAmount,
                        pickupLocation:
                          order.pickupLocation ||
                          "Main Canteen",
                      },
                    }}
                    className="view-order-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default MyOrders;
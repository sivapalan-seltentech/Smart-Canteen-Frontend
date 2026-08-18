import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

const ORDER_STATUSES = ["PLACED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

function EmployeeDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    if (!user?.id || String(user.role).toUpperCase() !== "EMPLOYEE") {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getOrdersByEmployee(user.id);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Employee orders error:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, [user?.id, user?.role]);

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          !["COMPLETED", "CANCELLED"].includes(
            String(order?.status || "").toUpperCase()
          )
      ),
    [orders]
  );

  const completedOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["COMPLETED", "CANCELLED"].includes(
          String(order?.status || "").toUpperCase()
        )
      ),
    [orders]
  );

  const changeStatus = async (orderId, status) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await loadOrders();
    } catch (error) {
      alert(error.message || "Unable to update order status.");
    }
  };

  if (!user) return null;

  const renderOrder = (order) => (
    <div className="employee-order-card" key={order.id}>
      <div className="employee-order-head">
        <div>
          <small>ORDER TOKEN</small>
          <h2>{order.tokenNumber}</h2>
          <p>
            🎓 {order.user?.name || "Student"} •{" "}
            {order.user?.studentId || "-"}
          </p>
        </div>

        <span
          className={`order-status status-${String(
            order.status || ""
          ).toLowerCase()}`}
        >
          {order.status}
        </span>
      </div>

      <div className="employee-order-meta">
        <span>
          <b>Order Date</b>
          {order.orderDate
            ? new Date(order.orderDate).toLocaleString()
            : "-"}
        </span>
        <span>
          <b>Total</b>
          ₹{Number(order.totalAmount || 0).toFixed(2)}
        </span>
      </div>

      <div className="employee-items">
        {(order.items || []).map((item) => (
          <span key={item.id}>
            {item.food?.name || "Food"} × {item.quantity}
          </span>
        ))}
      </div>

      <div className="employee-update">
        <label>
          Update Status
          <select
            value={order.status || "PLACED"}
            onChange={(e) => changeStatus(order.id, e.target.value)}
          >
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        {order.status === "READY" && (
          <div className="employee-ready">
            🎉 Your order is ready! Collect from Main Canteen.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="employee-page">
      <section className="employee-hero">
        <span>👨‍🍳 EMPLOYEE DASHBOARD</span>
        <h1>
          Welcome, <b>{user.name || "Employee"}</b>
        </h1>
        <p>
          Orders assigned to you are loaded directly from the MySQL database.
        </p>

        <div className="employee-summary">
          <div>
            <strong>{activeOrders.length}</strong>
            <span>Active Orders</span>
          </div>
          <div>
            <strong>{completedOrders.length}</strong>
            <span>Completed</span>
          </div>
        </div>
      </section>

      <section className="employee-section">
        <div className="employee-section-title">
          <span>ASSIGNED TO YOU</span>
          <h2>Current Orders</h2>
        </div>

        <div className="employee-grid">
          {loading ? (
            <div className="employee-empty">
              <div className="employee-empty-icon">⏳</div>
              <h3>Loading orders...</h3>
            </div>
          ) : activeOrders.length ? (
            activeOrders.map(renderOrder)
          ) : (
            <div className="employee-empty">
              <div className="employee-empty-icon">📦</div>
              <h3>No active orders assigned</h3>
              <p>The administrator will assign student orders to you.</p>
            </div>
          )}
        </div>

        {completedOrders.length > 0 && (
          <>
            <div className="employee-section-title completed-title">
              <span>ORDER HISTORY</span>
              <h2>Completed Orders</h2>
            </div>

            <div className="employee-grid">
              {completedOrders.map(renderOrder)}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default EmployeeDashboard;

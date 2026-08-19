import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";

const ORDER_STATUSES = [
  "PLACED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

function EmployeeDashboard() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const loadOrders = async () => {
    if (
      !user?.id ||
      String(user?.role).toUpperCase() !== "EMPLOYEE"
    ) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const data =
        await api.getOrdersByEmployee(user.id);

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Employee orders error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD ONLY
  // =====================================================

  useEffect(() => {
    loadOrders();
  }, [user?.id, user?.role]);

  // =====================================================
  // ACTIVE ORDERS
  // =====================================================

  const activeOrders = useMemo(() => {
    return orders.filter(
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
  }, [orders]);

  // =====================================================
  // COMPLETED ORDERS
  // =====================================================

  const completedOrders = useMemo(() => {
    return orders.filter((order) =>
      [
        "COMPLETED",
        "CANCELLED",
      ].includes(
        String(
          order?.status || ""
        ).toUpperCase()
      )
    );
  }, [orders]);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const changeStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const updated =
        await api.updateOrderStatus(
          orderId,
          status
        );

      /*
       * Update only this order.
       * No complete reload.
       */

      setOrders((previousOrders) =>
        previousOrders.map(
          (order) =>
            order.id === orderId
              ? {
                  ...order,
                  status:
                    updated?.status ||
                    status,
                }
              : order
        )
      );
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // =====================================================
  // USER CHECK
  // =====================================================

  if (!user) {
    return null;
  }

  // =====================================================
  // ORDER CARD
  // =====================================================

  const renderOrder = (order) => {
    const status = String(
      order?.status || "PLACED"
    ).toUpperCase();

    const isUpdating =
      updatingOrderId === order.id;

    return (
      <div
        className="employee-order-card"
        key={order.id}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="employee-order-head">
          <div>
            <small>
              ORDER TOKEN
            </small>

            <h2>
              {order.tokenNumber}
            </h2>

            <p>
              🎓{" "}
              {order.user?.name ||
                "Student"}{" "}
              •{" "}
              {order.user
                ?.studentId || "-"}
            </p>
          </div>

          <span
            className={`order-status status-${status.toLowerCase()}`}
          >
            {status}
          </span>
        </div>

        {/* =================================================
            META
        ================================================= */}

        <div className="employee-order-meta">
          <span>
            <b>
              Order Date
            </b>

            {order.orderDate
              ? new Date(
                  order.orderDate
                ).toLocaleString()
              : "-"}
          </span>

          <span>
            <b>
              Total
            </b>

            ₹
            {Number(
              order.totalAmount || 0
            ).toFixed(2)}
          </span>
        </div>

        {/* =================================================
            ITEMS
        ================================================= */}

        <div className="employee-items">
          {(order.items || []).map(
            (item) => (
              <span
                key={item.id}
              >
                {item.food?.name ||
                  "Food"}{" "}
                × {item.quantity}
              </span>
            )
          )}
        </div>

        {/* =================================================
            STATUS
        ================================================= */}

        <div className="employee-update">
          <label>
            Update Status

            <select
              value={status}
              onChange={(event) =>
                changeStatus(
                  order.id,
                  event.target.value
                )
              }
              disabled={isUpdating}
            >
              {ORDER_STATUSES.map(
                (itemStatus) => (
                  <option
                    key={
                      itemStatus
                    }
                    value={
                      itemStatus
                    }
                  >
                    {itemStatus}
                  </option>
                )
              )}
            </select>
          </label>

          {isUpdating && (
            <small className="employee-status-saving">
              Saving...
            </small>
          )}

          {status === "READY" && (
            <div className="employee-ready">
              🎉 Your order is ready!
              Collect from Main
              Canteen.
            </div>
          )}
        </div>
      </div>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="employee-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="employee-hero">
        <span>
          👨‍🍳 EMPLOYEE DASHBOARD
        </span>

        <h1>
          Welcome,{" "}
          <b>
            {user.name ||
              "Employee"}
          </b>
        </h1>

        <p>
          Orders assigned to you
          are loaded directly from
          the MySQL database.
        </p>

        <div className="employee-summary">
          <div>
            <strong>
              {activeOrders.length}
            </strong>

            <span>
              Active Orders
            </span>
          </div>

          <div>
            <strong>
              {completedOrders.length}
            </strong>

            <span>
              Completed
            </span>
          </div>
        </div>

        {/* MANUAL REFRESH */}

        <button
          type="button"
          className="employee-refresh-btn"
          onClick={loadOrders}
          disabled={loading}
        >
          🔄 Refresh Orders
        </button>
      </section>

      {/* =================================================
          ORDERS
      ================================================= */}

      <section className="employee-section">

        <div className="employee-section-title">
          <span>
            ASSIGNED TO YOU
          </span>

          <h2>
            Current Orders
          </h2>
        </div>

        <div className="employee-grid">

          {loading ? (
            <div className="employee-empty">
              <div className="employee-empty-icon">
                ⏳
              </div>

              <h3>
                Loading orders...
              </h3>
            </div>
          ) : activeOrders.length > 0 ? (
            activeOrders.map(
              renderOrder
            )
          ) : (
            <div className="employee-empty">
              <div className="employee-empty-icon">
                📦
              </div>

              <h3>
                No active orders
                assigned
              </h3>

              <p>
                The administrator
                will assign student
                orders to you.
              </p>
            </div>
          )}

        </div>

        {/* =================================================
            COMPLETED
        ================================================= */}

        {completedOrders.length >
          0 && (
          <>
            <div className="employee-section-title completed-title">
              <span>
                ORDER HISTORY
              </span>

              <h2>
                Completed Orders
              </h2>
            </div>

            <div className="employee-grid">
              {completedOrders.map(
                renderOrder
              )}
            </div>
          </>
        )}

      </section>
    </div>
  );
}

export default EmployeeDashboard;
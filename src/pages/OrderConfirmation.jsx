import { Link, useLocation } from "react-router-dom";

function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order;

  const orderData = order || {
    token: "N/A",
    studentName: "Student",
    studentId: "N/A",
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    pickupLocation: "Main Canteen",
    status: "PLACED",
  };

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

  return (
    <div className="confirmation-page">
      <section className="confirmation-hero">
        <div className="success-icon">✓</div>

        <span className="confirmation-badge">
          🎉 Order Confirmed
        </span>

        <h1>
          Your Order is <span>Confirmed!</span>
        </h1>

        <p>
          Your canteen order has been placed successfully.
          Please keep your token number for pickup.
        </p>
      </section>

      <section className="confirmation-section">
        <div className="confirmation-layout">

          {/* TOKEN */}
          <div className="token-card">
            <span className="token-label">
              YOUR ORDER TOKEN
            </span>

            <div className="token-number">
              {orderData.token || orderData.tokenNumber || "N/A"}
            </div>

            <p>
              Show this token at the canteen counter when
              collecting your order.
            </p>

            <div className="order-status">
              <span className="status-dot" />

              {getStatusText(orderData.status)}
            </div>
          </div>

          {/* DETAILS */}
          <div className="order-details-card">
            <div className="confirmation-card-header">
              <span>ORDER DETAILS</span>
              <h2>Order Information</h2>
            </div>

            <div className="detail-row">
              <span>Student Name</span>

              <strong>
                {orderData.studentName || "Student"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Student ID</span>

              <strong>
                {orderData.studentId || "N/A"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Pickup Location</span>

              <strong>
                {orderData.pickupLocation || "Main Canteen"}
              </strong>
            </div>

            <div className="detail-row">
              <span>Order Status</span>

              <strong className="confirmed-text">
                ✓ {getStatusText(orderData.status)}
              </strong>
            </div>
          </div>

          {/* ITEMS */}
          <div className="ordered-items-card">
            <div className="confirmation-card-header">
              <span>YOUR ITEMS</span>
              <h2>Ordered Items</h2>
            </div>

            {orderData.items?.length > 0 ? (
              <div className="ordered-items">
                {orderData.items.map((item, index) => {
                  const food = item.food || item;

                  const quantity =
                    Number(item.quantity || 0);

                  const price =
                    Number(
                      item.price ??
                        food.price ??
                        0
                    );

                  return (
                    <div
                      className="ordered-item"
                      key={
                        item.id ||
                        `${food.id || "food"}-${index}`
                      }
                    >
                      <div className="ordered-item-image">
  {food.image ? (
    <img
      src={food.image}
      alt={food.name || "Food"}
    />
  ) : (
    <span>{food.emoji || "🍽️"}</span>
  )}
</div>

                      <div className="ordered-item-info">
                        <h3>
                          {food.name || "Food"}
                        </h3>

                        <span>
                          Qty: {quantity}
                        </span>
                      </div>

                      <strong>
                        ₹
                        {(price * quantity).toFixed(2)}
                      </strong>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-order-items">
                No item details available.
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div className="confirmation-total-card">
            <div>
              <span>Total Amount</span>

              <small>
                Including 5% tax
              </small>
            </div>

            <strong>
              ₹
              {Number(
                orderData.total ??
                  orderData.totalAmount ??
                  0
              ).toFixed(2)}
            </strong>
          </div>

          {/* ACTIONS */}
          <div className="confirmation-actions">
            <Link
              to="/my-orders"
              className="view-orders-btn"
            >
              View My Orders
            </Link>

            <Link
              to="/menu"
              className="confirmation-menu-btn"
            >
              Order More Food
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}

export default OrderConfirmation;
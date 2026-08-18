import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";


const steps = [
  {
    key: "PLACED",
    title: "Pending",
    description:
      "Your order has been received and is waiting for processing.",
  },
  {
    key: "PREPARING",
    title: "Preparing",
    description:
      "Our canteen staff is preparing your food.",
  },
  {
    key: "READY",
    title: "Ready",
    description:
      "Your order is ready! Collect from Main Canteen.",
  },
  {
    key: "COMPLETED",
    title: "Completed",
    description:
      "Order successfully completed. Thank you!",
  },
];


function OrderTracking() {
  const { user } = useAuth();
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadOrders = async (initialLoad = false) => {
      if (!user?.id) {
        if (mounted) {
          setOrders([]);
          setLoading(false);
        }

        return;
      }

      try {
        /*
         * Only show loading during the FIRST request.
         *
         * Background refreshes must NOT touch loading.
         * This prevents the page from blinking.
         */
        if (initialLoad && mounted) {
          setLoading(true);
        }

        const data =
          await api.getOrdersByUser(user.id);

        if (mounted) {
          setOrders(
            Array.isArray(data)
              ? data
              : []
          );
        }
      } catch (error) {
        console.error(
          "Tracking load error:",
          error
        );

        /*
         * Do not clear existing orders during
         * a background refresh failure.
         *
         * This keeps the current UI visible.
         */
        if (initialLoad && mounted) {
          setOrders([]);
        }
      } finally {
        if (initialLoad && mounted) {
          setLoading(false);
        }
      }
    };

    // First load
    loadOrders(true);

    /*
     * Background refresh.
     *
     * IMPORTANT:
     * No setLoading(true) here.
     */
    const interval = setInterval(() => {
      loadOrders(false);
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user?.id]);


  // =====================================================
  // SELECT ORDER
  // =====================================================

  const selectedOrderId =
    location.state?.orderId;

  const order = useMemo(() => {
    if (selectedOrderId) {
      return (
        orders.find(
          (item) =>
            String(item.id) ===
            String(selectedOrderId)
        ) || null
      );
    }

    return (
      orders.find(
        (item) =>
          !["COMPLETED", "CANCELLED"].includes(
            String(
              item.status || ""
            ).toUpperCase()
          )
      ) ||
      orders[0] ||
      null
    );
  }, [
    orders,
    selectedOrderId,
  ]);


  // =====================================================
  // CURRENT STEP
  // =====================================================

  const currentIndex = Math.max(
    0,
    steps.findIndex(
      (step) =>
        step.key ===
        String(
          order?.status ||
          "PLACED"
        ).toUpperCase()
    )
  );


  // =====================================================
  // INITIAL LOADING ONLY
  // =====================================================

  if (loading) {
    return (
      <div className="tracking-page">
        <section className="tracking-hero">
          <span className="tracking-badge">
            📦 Order Tracking
          </span>

          <h1>
            Loading{" "}
            <span>Order...</span>
          </h1>
        </section>
      </div>
    );
  }


  // =====================================================
  // NO ORDER
  // =====================================================

  if (!order) {
    return (
      <div className="tracking-page">

        <section className="tracking-hero">

          <span className="tracking-badge">
            📦 Order Tracking
          </span>

          <h1>
            No{" "}
            <span>Active Order</span>
          </h1>

          <p>
            Place an order first to see
            live order tracking here.
          </p>

        </section>


        <section className="tracking-section">

          <div className="tracking-card tracking-empty">

            <div className="tracking-empty-icon">
              🚚
            </div>

            <h2>
              No order to track
            </h2>

            <p>
              Your current order status
              will appear here after checkout.
            </p>

            <Link
              to="/menu"
              className="tracking-menu-btn"
            >
              Browse Menu →
            </Link>

          </div>

        </section>

      </div>
    );
  }


  // =====================================================
  // STATUS
  // =====================================================

  const status =
    String(
      order.status || "PLACED"
    ).toUpperCase();

  const isReady =
    status === "READY";

  const isCancelled =
    status === "CANCELLED";


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="tracking-page">

      {/* ===============================================
          HERO
      =============================================== */}

      <section className="tracking-hero">

        <span className="tracking-badge">
          📦 Order Tracking
        </span>

        <h1>
          Track Your{" "}
          <span>Order</span>
        </h1>

        <p>
          Employee updates for this
          student order will appear here.
        </p>

      </section>


      {/* ===============================================
          TRACKING
      =============================================== */}

      <section className="tracking-section">

        <div className="tracking-card">


          {/* =========================================
              HEADER
          ========================================= */}

          <div className="tracking-header">

            <div>

              <span>
                ORDER TOKEN
              </span>

              <h2>
                {order.tokenNumber || "N/A"}
              </h2>

              <small>
                Student:{" "}
                {order.user?.name ||
                  user?.name ||
                  "Student"}
              </small>

            </div>


            <div
              className={
                `tracking-status tracking-status-${status.toLowerCase()}`
              }
            >
              {status}
            </div>

          </div>


          {/* =========================================
              READY NOTICE
          ========================================= */}

          {isReady && (
            <div className="ready-notice">

              <div className="ready-notice-icon">
                🎉
              </div>

              <div>

                <strong>
                  Your order is ready!
                </strong>

                <p>
                  Collect your order
                  from Main Canteen.
                </p>

              </div>

            </div>
          )}


          {/* =========================================
              CANCELLED NOTICE
          ========================================= */}

          {isCancelled && (
            <div className="ready-notice">

              <div className="ready-notice-icon">
                ❌
              </div>

              <div>

                <strong>
                  Order Cancelled
                </strong>

                <p>
                  This order has been
                  cancelled.
                </p>

              </div>

            </div>
          )}


          {/* =========================================
              PROGRESS
          ========================================= */}

          {!isCancelled && (
            <div className="tracking-progress">

              {steps.map(
                (step, index) => {

                  const active =
                    index <=
                    currentIndex;

                  const isCurrent =
                    index ===
                    currentIndex;

                  return (
                    <div
                      key={step.key}
                    >

                      <div
                        className={
                          `tracking-step ${
                            active
                              ? "active"
                              : ""
                          } ${
                            isCurrent
                              ? "current"
                              : ""
                          }`
                        }
                      >

                        <div className="tracking-circle">

                          {active
                            ? "✓"
                            : index + 1}

                        </div>


                        <div>

                          <h3>
                            {step.title}
                          </h3>

                          <p>
                            {
                              step.description
                            }
                          </p>

                        </div>

                      </div>


                      {index <
                        steps.length - 1 && (
                        <div
                          className={
                            `tracking-line ${
                              index <
                              currentIndex
                                ? "active"
                                : ""
                            }`
                          }
                        />
                      )}

                    </div>
                  );
                }
              )}

            </div>
          )}


          {/* =========================================
              PICKUP
          ========================================= */}

          <div className="tracking-pickup">

            <span>
              📍
            </span>

            <div>

              <strong>
                Pickup Location
              </strong>

              <p>
                {order.pickupLocation ||
                  "Main Canteen"}
              </p>

            </div>

          </div>


          {/* =========================================
              ACTIONS
          ========================================= */}

          <div className="tracking-actions">

            <Link
              to="/my-orders"
              className="tracking-back-btn"
            >
              ← My Orders
            </Link>

            <Link
              to="/menu"
              className="tracking-menu-btn"
            >
              Order More →
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


export default OrderTracking;
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../Cart.css";

function Cart() {

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
    loading,
  } = useCart();


  const tax = cartTotal * 0.05;

  const total = cartTotal + tax;


  if (loading) {

    return (
      <div className="cart-page">

        <section className="cart-hero">

          <span className="cart-badge">
            🛒 Your Cart
          </span>

          <h1>
            Loading <span>Cart...</span>
          </h1>

        </section>

      </div>
    );
  }


  // ==========================================
  // EMPTY CART
  // ==========================================

  if (cart.length === 0) {

    return (
      <div className="cart-page">

        <section className="cart-hero">

          <span className="cart-badge">
            🛒 Your Cart
          </span>

          <h1>
            Your <span>Cart</span>
          </h1>

          <p>
            Review your selected items before
            placing your order.
          </p>

        </section>


        <section className="cart-section">

          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>
              Your cart is empty
            </h2>

            <p>
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <Link
              to="/menu"
              className="browse-btn"
            >
              Browse Menu
            </Link>

          </div>

        </section>

      </div>
    );
  }


  return (
    <div className="cart-page">

      {/* HERO */}

      <section className="cart-hero">

        <span className="cart-badge">
          🛒 Your Cart
        </span>

        <h1>
          Review Your <span>Order</span>
        </h1>

        <p>
          Check your selected items, update
          quantities, and continue to checkout.
        </p>

      </section>


      {/* CART */}

      <section className="cart-section">

        <div className="cart-layout">


          {/* ITEMS */}

          <div className="cart-items">

            <div className="cart-title">

              <h2>
                Cart Items
              </h2>

              <span>
                {cart.length} item
                {cart.length !== 1 ? "s" : ""}
              </span>

            </div>


            {cart.map((item) => (

              <div
                className="cart-item"
                key={item.cartId}
              >

                {/* IMAGE */}

                <div className="cart-item-image">

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-real-image"
                      onError={(e) => {

                        e.currentTarget.style.display =
                          "none";

                        const fallback =
                          e.currentTarget.parentElement
                            .querySelector(
                              ".cart-image-fallback"
                            );

                        if (fallback) {

                          fallback.style.display =
                            "flex";

                        }

                      }}
                    />

                  ) : null}


                  <div
                    className="cart-image-fallback"
                    style={{
                      display: item.image
                        ? "none"
                        : "flex",
                    }}
                  >
                    {item.emoji || "🍽️"}
                  </div>

                </div>


                {/* INFO */}

                <div className="cart-item-info">

                  <span className="cart-item-category">
                    {item.category}
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    ₹
                    {Number(
                      item.price || 0
                    ).toFixed(2)}{" "}
                    each
                  </p>

                </div>


                {/* QUANTITY */}

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>

                </div>


                {/* TOTAL */}

                <div className="cart-item-total">

                  ₹
                  {(
                    Number(item.price || 0) *
                    Number(item.quantity || 0)
                  ).toFixed(2)}

                </div>


                {/* REMOVE */}

                <button
                  type="button"
                  className="remove-btn"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                  title="Remove item"
                >
                  ×
                </button>

              </div>

            ))}

          </div>


          {/* SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>
                ₹{cartTotal.toFixed(2)}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Tax (5%)
              </span>

              <strong>
                ₹{tax.toFixed(2)}
              </strong>

            </div>


            <div className="summary-divider" />


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{total.toFixed(2)}
              </strong>

            </div>


            <Link
              to="/checkout"
              className="checkout-btn"
            >
              Proceed to Checkout →
            </Link>


            <Link
              to="/menu"
              className="continue-btn"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Cart;
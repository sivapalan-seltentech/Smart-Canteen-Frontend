import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";

function Home() {
  const [menuItems, setMenuItems] = useState([]);

  const loadMenu = async () => {
    try {
      const items = await api.getMenu();
      setMenuItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Failed to load menu:", error);
      setMenuItems([]);
    }
  };

  const featuredItems = useMemo(() => {
    return menuItems.slice(0, 4);
  }, [menuItems]);

  const isImageUrl = (value) => {
    if (!value || typeof value !== "string") return false;

    return (
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("/") ||
      value.startsWith("./") ||
      value.startsWith("../") ||
      /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(value)
    );
  };

  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="home-hero">
        <div className="home-hero-content">

          <div className="home-hero-badge">
            🍱 Smart Food Ordering
          </div>

          <h1>
            Skip the Queue.
            <br />
            <span>Enjoy Your Food.</span>
          </h1>

          <p>
            Order your favourite meals online, get your digital token,
            track your order and collect your food without standing in
            long queues.
          </p>

          <div className="home-hero-actions">
            <Link to="/menu" className="home-primary-btn">
              Order Food →
            </Link>

            <Link to="/menu" className="home-secondary-btn">
              Explore Menu
            </Link>
          </div>

          <div className="home-hero-trust">
            <span>✓ Easy Ordering</span>
            <span>✓ Digital Token</span>
            <span>✓ Live Tracking</span>
          </div>
        </div>

        <div className="home-hero-visual">

          <div className="home-food-circle">
            🍛
          </div>

          <div className="home-floating-card home-floating-card-top">
            <span className="floating-icon">🎟️</span>
            <div>
              <strong>Digital Token</strong>
              <small>Order #SC1024</small>
            </div>
          </div>

          <div className="home-floating-card home-floating-card-bottom">
            <span className="floating-icon">🚚</span>
            <div>
              <strong>Order Ready</strong>
              <small>Collect from canteen</small>
            </div>
          </div>

        </div>
      </section>


      {/* ================= BENEFITS ================= */}

      <section className="home-benefits">

        <div className="home-benefit">
          <div className="home-benefit-icon">⚡</div>
          <div>
            <h3>Fast Ordering</h3>
            <p>Place your order in just a few clicks.</p>
          </div>
        </div>

        <div className="home-benefit">
          <div className="home-benefit-icon">🍱</div>
          <div>
            <h3>Fresh Food</h3>
            <p>Choose from today's available menu.</p>
          </div>
        </div>

        <div className="home-benefit">
          <div className="home-benefit-icon">🎟️</div>
          <div>
            <h3>Digital Token</h3>
            <p>Get a unique token for every order.</p>
          </div>
        </div>

        <div className="home-benefit">
          <div className="home-benefit-icon">📱</div>
          <div>
            <h3>Live Tracking</h3>
            <p>Know when your food is ready.</p>
          </div>
        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="home-section home-how-section">

        <div className="home-section-heading">
          <span className="home-section-label">
            SIMPLE PROCESS
          </span>

          <h2>
            How Smart Canteen <span>Works</span>
          </h2>

          <p>
            Four simple steps to enjoy your food without waiting
            in a queue.
          </p>
        </div>


        <div className="home-steps">

          <div className="home-step-card">
            <span className="home-step-number">01</span>

            <div className="home-step-icon">
              🍔
            </div>

            <h3>Browse Menu</h3>

            <p>
              Explore the available food items and choose
              your favourite meal.
            </p>
          </div>


          <div className="home-step-card">
            <span className="home-step-number">02</span>

            <div className="home-step-icon">
              🛒
            </div>

            <h3>Place Your Order</h3>

            <p>
              Add your food to the cart and confirm your
              order quickly.
            </p>
          </div>


          <div className="home-step-card">
            <span className="home-step-number">03</span>

            <div className="home-step-icon">
              👨‍🍳
            </div>

            <h3>We Prepare It</h3>

            <p>
              Canteen employees receive your order and
              start preparing it.
            </p>
          </div>


          <div className="home-step-card">
            <span className="home-step-number">04</span>

            <div className="home-step-icon">
              🏃
            </div>

            <h3>Pick It Up</h3>

            <p>
              Track your order and collect it when the
              status becomes Ready.
            </p>
          </div>

        </div>

      </section>


      {/* ================= FEATURED MENU ================= */}

      <section className="home-section home-menu-section">

        <div className="home-section-heading home-menu-heading">

          <div>
            <span className="home-section-label">
              TODAY'S MENU
            </span>

            <h2>
              Something <span>Delicious</span>
            </h2>

            <p>
              Freshly available food from Smart Canteen.
            </p>
          </div>

          <Link
            to="/menu"
            className="home-view-menu-btn"
          >
            View Full Menu →
          </Link>

        </div>


        {featuredItems.length > 0 ? (

          <div className="home-food-grid">

            {featuredItems.map((food) => {

              const imageUrl = isImageUrl(food.image)
                ? food.image
                : null;

              return (
                <div
                  className="home-food-card"
                  key={food.id}
                >

                  <div className="home-food-image">

                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={food.name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";

                          const fallback =
                            e.currentTarget.parentElement.querySelector(
                              ".home-food-fallback"
                            );

                          if (fallback) {
                            fallback.style.display = "flex";
                          }
                        }}
                      />
                    ) : null}

                    <div
                      className="home-food-fallback"
                      style={{
                        display: imageUrl ? "none" : "flex",
                      }}
                    >
                      {food.emoji || "🍽️"}
                    </div>

                    <span className="home-food-rating">
                      ⭐ {food.rating || "4.5"}
                    </span>

                  </div>


                  <div className="home-food-content">

                    <span className="home-food-category">
                      {food.category?.name || food.category || "Food"}
                    </span>

                    <h3>{food.name}</h3>

                    <p>
                      {food.description ||
                        "Delicious food from Smart Canteen."}
                    </p>

                    <div className="home-food-bottom">

                      <strong>
                        ₹{Number(food.price || 0).toFixed(2)}
                      </strong>

                      <Link
                        to="/menu"
                        className="home-food-btn"
                      >
                        Order
                      </Link>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          <div className="home-no-menu">
            <div>🍽️</div>
            <h3>Menu Coming Soon</h3>
            <p>
              Our canteen menu will appear here once food items
              are added by the administrator.
            </p>

            <Link to="/menu">
              Browse Menu →
            </Link>
          </div>

        )}

      </section>


      {/* ================= WHY SMART CANTEEN ================= */}

      <section className="home-section home-why-section">

        <div className="home-section-heading">

          <span className="home-section-label">
            WHY SMART CANTEEN?
          </span>

          <h2>
            A Better Way to Use Your <span>Canteen</span>
          </h2>

          <p>
            Everything you need for a faster and more convenient
            campus food experience.
          </p>

        </div>


        <div className="home-why-grid">

          <div className="home-why-card">
            <div className="home-why-icon">🚫</div>
            <h3>No Long Queues</h3>
            <p>
              Place your order before reaching the canteen
              and save valuable time.
            </p>
          </div>


          <div className="home-why-card">
            <div className="home-why-icon">🎟️</div>
            <h3>Digital Order Token</h3>
            <p>
              Every order gets a unique token so you can
              easily identify and collect your food.
            </p>
          </div>


          <div className="home-why-card">
            <div className="home-why-icon">📲</div>
            <h3>Live Order Status</h3>
            <p>
              Track your order through Pending, Preparing,
              Ready and Completed stages.
            </p>
          </div>


          <div className="home-why-card">
            <div className="home-why-icon">👨‍🍳</div>
            <h3>Smart Management</h3>
            <p>
              Admins manage employees and orders while
              employees handle assigned orders efficiently.
            </p>
          </div>

        </div>

      </section>


      {/* ================= USER ROLES ================= */}

      <section className="home-roles-section">

        <div className="home-section-heading">

          <span className="home-section-label">
            ONE PLATFORM
          </span>

          <h2>
            Built for Everyone in the <span>Canteen</span>
          </h2>

        </div>


        <div className="home-roles">

          <div className="home-role-card">

            <div className="home-role-icon">
              🎓
            </div>

            <h3>Students</h3>

            <p>
              Browse food, place orders, receive tokens and
              track your food in real time.
            </p>

            <Link to="/menu">
              Start Ordering →
            </Link>

          </div>


          <div className="home-role-card">

            <div className="home-role-icon">
              👨‍🍳
            </div>

            <h3>Employees</h3>

            <p>
              View assigned orders and update their status
              from Pending to Completed.
            </p>

            <Link to="/employee-login">
              Employee Login →
            </Link>

          </div>


          <div className="home-role-card">

            <div className="home-role-icon">
              👨‍💼
            </div>

            <h3>Administrators</h3>

            <p>
              Manage menu items, students, employees and
              assign orders to the right employee.
            </p>

            <Link to="/admin-login">
              Admin Login →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}

      <section className="home-cta">

        <div className="home-cta-content">

          <span className="home-cta-icon">
            🍱
          </span>

          <h2>
            Hungry? Your Food Is Just
            <span> a Few Clicks Away.</span>
          </h2>

          <p>
            Skip the queue, order online and enjoy a smarter
            canteen experience.
          </p>

          <Link
            to="/menu"
            className="home-cta-btn"
          >
            Browse Today's Menu →
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;
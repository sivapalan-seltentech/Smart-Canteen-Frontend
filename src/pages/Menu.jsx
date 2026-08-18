import { useEffect, useMemo, useState } from "react";
import "../menu.css";
import { useCart } from "../context/CartContext";
import { api } from "../utils/api";

function Menu() {
  const { addToCart, cartCount } = useCart();

  const [foodItems, setFoodItems] = useState([]);
  const [categoriesFromDb, setCategoriesFromDb] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const [foods, categories] = await Promise.all([
        api.getMenu(),
        api.getCategories(),
      ]);

      setFoodItems(Array.isArray(foods) ? foods : []);
      setCategoriesFromDb(Array.isArray(categories) ? categories : []);
    } catch (error) {
      console.error("Failed to load menu:", error);
      setFoodItems([]);
      setCategoriesFromDb([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();

    const refresh = () => loadMenu();
    window.addEventListener("menuUpdated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("menuUpdated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const categories = useMemo(() => {
    const names = categoriesFromDb
      .map((category) => category?.name)
      .filter(Boolean);

    const foodCategoryNames = foodItems
      .map((food) =>
        typeof food?.category === "object"
          ? food.category?.name
          : food?.category
      )
      .filter(Boolean);

    return [
      "All",
      ...new Set([...names, ...foodCategoryNames]),
    ];
  }, [categoriesFromDb, foodItems]);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();

    return foodItems.filter((food) => {
      const categoryName =
        typeof food?.category === "object"
          ? food.category?.name
          : food?.category;

      const categoryMatch =
        activeCategory === "All" ||
        categoryName === activeCategory;

      const searchText =
        `${food?.name || ""} ${food?.description || ""} ${categoryName || ""}`
          .toLowerCase();

      return categoryMatch && searchText.includes(query);
    });
  }, [foodItems, activeCategory, search]);

  const hasImage = (food) =>
    typeof food?.image === "string" &&
    food.image.trim().length > 0;

  return (
    <div className="menu-page">
      <section className="menu-hero">
        <div className="menu-hero-content">
          <span className="menu-badge">🍴 Fresh & Delicious</span>
          <h1>
            Explore Our <span>Menu</span>
          </h1>
          <p>
            Browse delicious meals, snacks and beverages available at Smart
            Canteen.
          </p>
        </div>
      </section>

      <section className="menu-section">
        <div className="menu-heading">
          <div>
            <span className="section-label">OUR MENU</span>
            <h2>Choose Your Favourite</h2>
          </div>

          <div className="menu-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="category-list">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-btn ${
                activeCategory === category ? "active" : ""
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="cart-info">
          🛒 Cart: <strong>{cartCount}</strong>
        </div>

        {loading ? (
          <div className="no-food">
            <span>⏳</span>
            <h3>Loading menu...</h3>
            <p>Fetching the latest foods from MySQL.</p>
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="food-grid">
            {filteredFoods.map((food) => {
              const categoryName =
                typeof food?.category === "object"
                  ? food.category?.name
                  : food?.category;

              return (
                <div className="menu-card" key={food.id}>
                  <div className="food-image">
                    {hasImage(food) ? (
                      <img
                        src={food.image}
                        alt={food.name}
                        className="food-real-image"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback =
                            e.currentTarget.parentElement.querySelector(
                              ".food-image-fallback"
                            );
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}

                    <div
                      className="food-image-fallback"
                      style={{
                        display: hasImage(food) ? "none" : "flex",
                      }}
                    >
                      {food.emoji || "🍽️"}
                    </div>

                    <div className="rating">
                      ⭐ {Number(food.rating || 4.5).toFixed(1)}
                    </div>
                  </div>

                  <div className="food-content">
                    <span className="food-category">
                      {categoryName || "Food"}
                    </span>

                    <h3>{food.name}</h3>

                    <p>
                      {food.description ||
                        "Delicious food from Smart Canteen."}
                    </p>

                    <div className="food-bottom">
                      <span className="food-price">
                        ₹{Number(food.price || 0).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        className="add-cart-btn"
                        onClick={() => addToCart(food)}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-food">
            <span>😕</span>
            <h3>No food found</h3>
            <p>Try another category or search.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default Menu;

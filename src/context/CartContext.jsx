import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { api } from "../utils/api";

const CartContext = createContext(null);

function mapCartItem(item) {
  const food = item?.food || {};
  const category =
    typeof food.category === "object"
      ? food.category?.name || ""
      : food.category || "";

  return {
    cartId: item?.id,
    id: food?.id,
    name: food?.name || "Food Item",
    price: Number(food?.price || 0),
    image: food?.image || "",
    emoji: food?.emoji || "🍽️",
    rating: Number(food?.rating || 4.5),
    category,
    description: food?.description || "",
    quantity: Number(item?.quantity || 1),
  };
}

export function CartProvider({ children }) {
  const { user, isLoggedIn } = useAuth();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!user?.id) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getCart(user.id);
      setCart(Array.isArray(data) ? data.map(mapCartItem) : []);
    } catch (error) {
      console.error("Load cart error:", error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [isLoggedIn, user?.id]);

  const addToCart = async (food) => {
    if (!food?.id) {
      alert("Invalid food item.");
      return;
    }

    if (!user?.id) {
      alert("Please login before adding items to cart.");
      return;
    }

    try {
      await api.addToCart(user.id, food.id, 1);
      await loadCart();
    } catch (error) {
      console.error("Add to cart error:", error);
      alert(error.message || "Unable to add item to cart. Please try again.");
    }
  };

  const increaseQuantity = async (id) => {
    const item = cart.find(
      (cartItem) => String(cartItem.id) === String(id)
    );
    if (!item?.cartId) return;

    try {
      await api.updateCart(
        item.cartId,
        Number(item.quantity || 0) + 1
      );
      await loadCart();
    } catch (error) {
      console.error("Increase quantity error:", error);
      alert(error.message || "Unable to update cart.");
    }
  };

  const decreaseQuantity = async (id) => {
    const item = cart.find(
      (cartItem) => String(cartItem.id) === String(id)
    );
    if (!item?.cartId) return;

    try {
      const nextQuantity = Number(item.quantity || 0) - 1;

      if (nextQuantity <= 0) {
        await api.deleteCart(item.cartId);
      } else {
        await api.updateCart(item.cartId, nextQuantity);
      }

      await loadCart();
    } catch (error) {
      console.error("Decrease quantity error:", error);
      alert(error.message || "Unable to update cart.");
    }
  };

  const removeFromCart = async (id) => {
    const item = cart.find(
      (cartItem) => String(cartItem.id) === String(id)
    );
    if (!item?.cartId) return;

    try {
      await api.deleteCart(item.cartId);
      await loadCart();
    } catch (error) {
      console.error("Remove cart error:", error);
      alert(error.message || "Unable to remove item from cart.");
    }
  };

  const clearCart = async () => {
    if (!user?.id) {
      setCart([]);
      return;
    }

    try {
      await api.clearCart(user.id);
    } catch (error) {
      console.error("Clear cart error:", error);
    } finally {
      setCart([]);
    }
  };

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

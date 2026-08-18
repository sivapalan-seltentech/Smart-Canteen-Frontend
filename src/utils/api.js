const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8085/api";

async function request(path, options = {}) {
  const token = localStorage.getItem(
    "smartCanteenToken"
  );

  const headers = {
    Accept: "application/json",

    ...(options.body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),

    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${path}`,
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    throw new Error(
      "Cannot connect to backend. Make sure Spring Boot is running on http://localhost:8085."
    );
  }

  const text = await response.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (response.status === 401) {
    localStorage.removeItem(
      "smartCanteenToken"
    );

    localStorage.removeItem(
      "smartCanteenUser"
    );

    window.dispatchEvent(
      new Event("authExpired")
    );
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" &&
      data.trim()
        ? data
        : `Request failed (${response.status})`);

    throw new Error(message);
  }

  return data;
}

export const api = {
  // =========================
  // AUTH
  // =========================

  login: (identifier, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identifier,
        password,
      }),
    }),

  register: (user) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),

  getCurrentUser: () =>
    request("/auth/me"),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  // =========================
  // USERS
  // =========================

  getUsers: () =>
    request("/admin/users"),

  getUser: (id) =>
    request(`/admin/users/${id}`),

  updateUser: (id, user) =>
    request(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    }),

  deleteUser: (id) =>
    request(`/admin/users/${id}`, {
      method: "DELETE",
    }),

  adminDashboard: () =>
    request("/admin/dashboard"),

  // =========================
  // EMPLOYEES
  // =========================

  getEmployees: () =>
    request("/employees"),

  getEmployee: (id) =>
    request(`/employees/${id}`),

  createEmployee: (employee) =>
    request("/employees", {
      method: "POST",
      body: JSON.stringify(employee),
    }),

  updateEmployee: (id, employee) =>
    request(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(employee),
    }),

  deleteEmployee: (id) =>
    request(`/employees/${id}`, {
      method: "DELETE",
    }),

  // =========================
  // FOODS
  // =========================

  getMenu: () =>
    request("/foods"),

  getMenuItem: (id) =>
    request(`/foods/${id}`),

  createMenuItem: (food) =>
    request("/foods", {
      method: "POST",
      body: JSON.stringify(food),
    }),

  updateMenuItem: (id, food) =>
    request(`/foods/${id}`, {
      method: "PUT",
      body: JSON.stringify(food),
    }),

  deleteMenuItem: (id) =>
    request(`/foods/${id}`, {
      method: "DELETE",
    }),

  // =========================
  // CATEGORIES
  // =========================

  getCategories: () =>
    request("/categories"),

  getCategory: (id) =>
    request(`/categories/${id}`),

  createCategory: (category) =>
    request("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    }),

  updateCategory: (id, category) =>
    request(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    }),

  deleteCategory: (id) =>
    request(`/categories/${id}`, {
      method: "DELETE",
    }),

  // =========================
  // CART
  // =========================

  getCart: (userId) =>
    request(`/cart/user/${userId}`),

  addToCart: (
    userId,
    foodId,
    quantity = 1
  ) =>
    request("/cart", {
      method: "POST",
      body: JSON.stringify({
        userId,
        foodId,
        quantity,
      }),
    }),

  updateCart: (id, quantity) =>
    request(`/cart/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        quantity,
      }),
    }),

  deleteCart: (id) =>
    request(`/cart/${id}`, {
      method: "DELETE",
    }),

  clearCart: (userId) =>
    request(`/cart/user/${userId}`, {
      method: "DELETE",
    }),

  // =========================
  // ORDERS
  // =========================

  getOrders: () =>
    request("/orders"),

  getOrder: (id) =>
    request(`/orders/${id}`),

  getOrdersByUser: (userId) =>
    request(`/orders/user/${userId}`),

  placeOrder: (userId) =>
    request(`/orders/place/${userId}`, {
      method: "POST",
    }),

  updateOrderStatus: (
    id,
    status
  ) =>
    request(
      `/orders/${id}/status?status=${encodeURIComponent(
        status
      )}`,
      {
        method: "PUT",
      }
    ),

  cancelOrder: (id) =>
    request(`/orders/${id}/cancel`, {
      method: "PUT",
    }),

  assignEmployee: (
    orderId,
    employeeId
  ) =>
    request(
      `/orders/${orderId}/assign/${employeeId}`,
      {
        method: "PUT",
      }
    ),

  getOrdersByEmployee: (
    employeeId
  ) =>
    request(
      `/orders/employee/${employeeId}`
    ),

  getPendingEmployeeOrders: (
    employeeId
  ) =>
    request(
      `/orders/employee/${employeeId}/pending`
    ),
};

export { API_BASE_URL };

export default API_BASE_URL;
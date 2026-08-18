const ORDERS_KEY = "studentOrders";

export function getOrders() {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    const orders = raw ? JSON.parse(raw) : [];
    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Unable to read orders:", error);
    return [];
  }
}

export function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));
}

export function addOrder(order) {
  const newOrder = {
    ...order,
    status: order.status || "Pending",
    assignedEmployeeId: order.assignedEmployeeId || "",
    assignedEmployeeName: order.assignedEmployeeName || "",
    statusHistory: order.statusHistory || [
      {
        status: order.status || "Pending",
        time: new Date().toLocaleString(),
      },
    ],
  };

  saveOrders([newOrder, ...getOrders()]);
  localStorage.setItem("smartCanteenLastOrder", JSON.stringify(newOrder));
  return newOrder;
}

export function updateOrderStatus(token, status) {
  const orders = getOrders();

  const updatedOrders = orders.map((order) => {
    if (order.token !== token) return order;

    const history = Array.isArray(order.statusHistory)
      ? order.statusHistory
      : [];

    return {
      ...order,
      status,
      statusHistory: [
        ...history,
        {
          status,
          time: new Date().toLocaleString(),
        },
      ],
    };
  });

  saveOrders(updatedOrders);

  const updated = updatedOrders.find((order) => order.token === token);
  if (updated) {
    localStorage.setItem("smartCanteenLastOrder", JSON.stringify(updated));
  }

  return updated;
}

export function assignOrderToEmployee(token, employee) {
  const orders = getOrders();

  const updatedOrders = orders.map((order) => {
    if (order.token !== token) return order;

    return {
      ...order,
      assignedEmployeeId: employee?.id ? String(employee.id) : "",
      assignedEmployeeName: employee?.name || "",
    };
  });

  saveOrders(updatedOrders);

  const updated = updatedOrders.find((order) => order.token === token);
  if (updated) {
    localStorage.setItem("smartCanteenLastOrder", JSON.stringify(updated));
  }

  return updated;
}

export function getOrdersForStudent(studentId) {
  return getOrders().filter(
    (order) =>
      String(order.studentId || "").toLowerCase() ===
      String(studentId || "").toLowerCase()
  );
}

export function getOrdersForEmployee(employeeId) {
  return getOrders().filter(
    (order) => String(order.assignedEmployeeId || "") === String(employeeId || "")
  );
}

export const ORDER_STATUSES = [
  "Pending",
  "Preparing",
  "Ready",
  "Completed",
];

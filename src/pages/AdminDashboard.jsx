import { useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";

const ORDER_STATUSES = [
  "PLACED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

const emptyFood = {
  name: "",
  categoryId: "",
  price: "",
  image: "",
  emoji: "🍽️",
  rating: 4.5,
  description: "",
};

const emptyEmployee = {
  name: "",
  employeeId: "",
  username: "",
  password: "",
  email: "",
  phone: "",
};

function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  const [stats, setStats] = useState(null);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);

  const [newFood, setNewFood] = useState(emptyFood);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });
  const [newEmployee, setNewEmployee] =
    useState(emptyEmployee);

  const [foodImagePreview, setFoodImagePreview] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  const loadAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        dashboard,
        foods,
        categoryList,
        users,
        employeeList,
        orderList,
      ] = await Promise.all([
        api.adminDashboard(),
        api.getMenu(),
        api.getCategories(),
        api.getUsers(),
        api.getEmployees(),
        api.getOrders(),
      ]);

      setStats(dashboard || null);

      setMenu(
        Array.isArray(foods)
          ? foods
          : []
      );

      setCategories(
        Array.isArray(categoryList)
          ? categoryList
          : []
      );

      setStudents(
        Array.isArray(users)
          ? users.filter(
              (user) =>
                String(
                  user?.role || "STUDENT"
                ).toUpperCase() === "STUDENT"
            )
          : []
      );

      setEmployees(
        Array.isArray(employeeList)
          ? employeeList
          : []
      );

      setOrders(
        Array.isArray(orderList)
          ? orderList
          : []
      );
    } catch (err) {
      console.error(
        "Admin load error:",
        err
      );

      setError(
        err.message ||
          "Unable to load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadAll();
  }, []);

  // =====================================================
  // COMPUTED STATS
  // =====================================================

  const computedStats = useMemo(
    () => ({
      orders: orders.length,

      students:
        students.length,

      employees:
        employees.length,

      menu:
        menu.length,

      pending: orders.filter(
        (order) =>
          ![
            "COMPLETED",
            "CANCELLED",
          ].includes(
            String(
              order?.status || ""
            ).toUpperCase()
          )
      ).length,
    }),
    [
      orders,
      students,
      employees,
      menu,
    ]
  );

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "Please select an image file."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Image size must be less than 5MB."
      );
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const image =
        String(
          reader.result || ""
        );

      setNewFood(
        (prev) => ({
          ...prev,
          image,
        })
      );

      setFoodImagePreview(
        image
      );
    };

    reader.readAsDataURL(
      file
    );
  };

  // =====================================================
  // ADD CATEGORY
  // =====================================================

  const addCategory = async (
    event
  ) => {
    event.preventDefault();

    if (
      !newCategory.name.trim()
    ) {
      alert(
        "Enter a category name."
      );
      return;
    }

    try {
      setActionLoading(true);

      const created =
        await api.createCategory({
          name:
            newCategory.name.trim(),

          description:
            newCategory.description.trim(),
        });

      /*
       * Update category locally.
       * No full dashboard reload.
       */

      if (created) {
        setCategories(
          (prev) => [
            ...prev,
            created,
          ]
        );
      } else {
        await loadAll();
      }

      setNewCategory({
        name: "",
        description: "",
      });
    } catch (err) {
      alert(
        err.message ||
          "Unable to create category."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  const deleteCategory = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this category? Foods using it may prevent deletion."
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);

      await api.deleteCategory(id);

      /*
       * Remove only deleted category
       */

      setCategories(
        (prev) =>
          prev.filter(
            (category) =>
              category.id !== id
          )
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to delete category."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // ADD FOOD
  // =====================================================

  const addFood = async (
    event
  ) => {
    event.preventDefault();

    if (
      !newFood.name.trim() ||
      !newFood.price ||
      !newFood.categoryId
    ) {
      alert(
        "Food name, category and price are required."
      );
      return;
    }

    try {
      setActionLoading(true);

      const created =
        await api.createMenuItem({
          name:
            newFood.name.trim(),

          price:
            Number(
              newFood.price
            ),

          image:
            newFood.image || "",

          emoji:
            newFood.emoji ||
            "🍽️",

          rating:
            Number(
              newFood.rating ||
                4.5
            ),

          description:
            newFood.description.trim(),

          category: {
            id:
              Number(
                newFood.categoryId
              ),
          },
        });

      /*
       * Add new food locally.
       */

      if (created) {
        setMenu(
          (prev) => [
            ...prev,
            created,
          ]
        );
      } else {
        await loadAll();
      }

      setNewFood(
        emptyFood
      );

      setFoodImagePreview("");

      const input =
        document.getElementById(
          "food-image-input"
        );

      if (input) {
        input.value = "";
      }
    } catch (err) {
      alert(
        err.message ||
          "Unable to create food."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE FOOD
  // =====================================================

  const removeFood = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this food?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);

      await api.deleteMenuItem(id);

      setMenu(
        (prev) =>
          prev.filter(
            (item) =>
              item.id !== id
          )
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to delete food."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // ADD EMPLOYEE
  // =====================================================

  const addEmployee = async (
    event
  ) => {
    event.preventDefault();

    if (
      !newEmployee.name.trim() ||
      !newEmployee.employeeId.trim() ||
      !newEmployee.username.trim() ||
      !newEmployee.password
    ) {
      alert(
        "Name, Employee ID, username and password are required."
      );
      return;
    }

    try {
      setActionLoading(true);

      const created =
        await api.createEmployee({
          name:
            newEmployee.name.trim(),

          employeeId:
            newEmployee.employeeId.trim(),

          username:
            newEmployee.username.trim(),

          password:
            newEmployee.password,

          email:
            newEmployee.email.trim() ||
            null,

          phone:
            newEmployee.phone.trim() ||
            null,
        });

      if (created) {
        setEmployees(
          (prev) => [
            ...prev,
            created,
          ]
        );
      } else {
        await loadAll();
      }

      setNewEmployee(
        emptyEmployee
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to create employee."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE EMPLOYEE
  // =====================================================

  const removeEmployee = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this employee?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);

      await api.deleteEmployee(id);

      setEmployees(
        (prev) =>
          prev.filter(
            (employee) =>
              employee.id !== id
          )
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to delete employee."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (
    id
  ) => {
    if (
      !window.confirm(
        "Remove this student account?"
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);

      await api.deleteUser(id);

      setStudents(
        (prev) =>
          prev.filter(
            (student) =>
              student.id !== id
          )
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to remove student."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // ASSIGN EMPLOYEE - FIXED
  // =====================================================

  const assignEmployee = async (
    orderId,
    employeeId
  ) => {
    if (!employeeId) {
      return;
    }

    try {
      setActionLoading(true);

      /*
       * Backend/MySQL update
       */
      const updated =
        await api.assignEmployee(
          orderId,
          Number(employeeId)
        );

      /*
       * IMPORTANT:
       * Do NOT call loadAll().
       *
       * Update only this order in React state.
       */

      setOrders(
        (prevOrders) =>
          prevOrders.map(
            (order) => {
              if (
                order.id !== orderId
              ) {
                return order;
              }

              const selectedEmployee =
                employees.find(
                  (employee) =>
                    employee.id ===
                    Number(
                      employeeId
                    )
                );

              return {
                ...order,

                assignedEmployee:
                  updated?.assignedEmployee ||
                  selectedEmployee ||
                  order.assignedEmployee,
              };
            }
          )
      );
    } catch (err) {
      alert(
        err.message ||
          "Unable to assign employee."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS - FIXED
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setActionLoading(true);

      /*
       * Backend/MySQL update
       */
      const updated =
        await api.updateOrderStatus(
          orderId,
          status
        );

      /*
       * IMPORTANT:
       * No loadAll().
       *
       * Only update selected order.
       */

      setOrders(
        (prevOrders) =>
          prevOrders.map(
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
    } catch (err) {
      alert(
        err.message ||
          "Unable to update order status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const nav = [
    [
      "overview",
      "📊 Overview",
    ],
    [
      "menu",
      "🍔 Menu Management",
    ],
    [
      "students",
      "🎓 Student Management",
    ],
    [
      "employees",
      "👨‍🍳 Employee Management",
    ],
    [
      "orders",
      "📦 Order Management",
    ],
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="admin-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          🍔 Smart Canteen
        </div>

        <nav className="admin-nav">
          {nav.map(
            ([key, label]) => (
              <button
                type="button"
                key={key}
                className={
                  tab === key
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setTab(key)
                }
              >
                {label}
              </button>
            )
          )}
        </nav>

        <button
          type="button"
          className="admin-refresh-btn"
          onClick={loadAll}
          disabled={
            loading ||
            actionLoading
          }
        >
          🔄 Refresh MySQL
        </button>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        <div className="admin-topbar">

          <div>

            <span className="admin-badge">
              ADMIN PANEL
            </span>

            <h1>
              Smart Canteen{" "}
              <span>
                Management
              </span>
            </h1>

            <p>
              All records below are
              loaded from MySQL
              through Spring Boot.
            </p>

          </div>

        </div>

        {error && (
          <div className="admin-error">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="admin-panel">
            <h2>
              Loading database data...
            </h2>
          </div>
        ) : (
          <>

            {/* =================================================
                OVERVIEW
            ================================================= */}

            {tab === "overview" && (
              <section className="admin-stats-grid">

                {[
                  [
                    "Orders",
                    stats?.totalOrders ??
                      computedStats.orders,
                    "📦",
                  ],

                  [
                    "Students",
                    stats?.totalStudents ??
                      computedStats.students,
                    "🎓",
                  ],

                  [
                    "Employees",
                    stats?.totalEmployees ??
                      computedStats.employees,
                    "👨‍🍳",
                  ],

                  [
                    "Foods",
                    stats?.totalFoods ??
                      computedStats.menu,
                    "🍔",
                  ],

                  [
                    "Pending",
                    stats?.pendingOrders ??
                      computedStats.pending,
                    "⏳",
                  ],

                  [
                    "Categories",
                    stats?.totalCategories ??
                      categories.length,
                    "🏷️",
                  ],
                ].map(
                  ([
                    label,
                    value,
                    icon,
                  ]) => (
                    <div
                      className="admin-stat-card"
                      key={label}
                    >
                      <span>
                        {icon}
                      </span>

                      <strong>
                        {value}
                      </strong>

                      <small>
                        {label}
                      </small>
                    </div>
                  )
                )}

              </section>
            )}

            {/* =================================================
                MENU
            ================================================= */}

            {tab === "menu" && (
              <>
                <section className="admin-content-grid">

                  {/* CATEGORY */}

                  <div className="admin-panel">

                    <h2>
                      Add Category
                    </h2>

                    <form
                      className="admin-form"
                      onSubmit={
                        addCategory
                      }
                    >

                      <input
                        placeholder="Category name"
                        value={
                          newCategory.name
                        }
                        onChange={(e) =>
                          setNewCategory(
                            (prev) => ({
                              ...prev,
                              name:
                                e.target.value,
                            })
                          )
                        }
                      />

                      <input
                        placeholder="Description (optional)"
                        value={
                          newCategory.description
                        }
                        onChange={(e) =>
                          setNewCategory(
                            (prev) => ({
                              ...prev,
                              description:
                                e.target.value,
                            })
                          )
                        }
                      />

                      <button
                        className="admin-primary-btn"
                        disabled={
                          actionLoading
                        }
                      >
                        Add Category
                      </button>

                    </form>

                    <h3>
                      Categories (
                      {
                        categories.length
                      }
                      )
                    </h3>

                    {categories.map(
                      (category) => (
                        <div
                          className="admin-row"
                          key={
                            category.id
                          }
                        >

                          <span>
                            <b>
                              {
                                category.name
                              }
                            </b>

                            <small>
                              {category.description ||
                                "No description"}
                            </small>
                          </span>

                          <button
                            type="button"
                            className="admin-danger-btn"
                            onClick={() =>
                              deleteCategory(
                                category.id
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            Delete
                          </button>

                        </div>
                      )
                    )}

                  </div>

                  {/* FOOD */}

                  <div className="admin-panel">

                    <h2>
                      Add Food
                    </h2>

                    <form
                      className="admin-form"
                      onSubmit={
                        addFood
                      }
                    >

                      <input
                        placeholder="Food name"
                        value={
                          newFood.name
                        }
                        onChange={(e) =>
                          setNewFood(
                            (prev) => ({
                              ...prev,
                              name:
                                e.target.value,
                            })
                          )
                        }
                      />

                      <select
                        value={
                          newFood.categoryId
                        }
                        onChange={(e) =>
                          setNewFood(
                            (prev) => ({
                              ...prev,
                              categoryId:
                                e.target.value,
                            })
                          )
                        }
                      >

                        <option value="">
                          Select category
                        </option>

                        {categories.map(
                          (category) => (
                            <option
                              key={
                                category.id
                              }
                              value={
                                category.id
                              }
                            >
                              {
                                category.name
                              }
                            </option>
                          )
                        )}

                      </select>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Price"
                        value={
                          newFood.price
                        }
                        onChange={(e) =>
                          setNewFood(
                            (prev) => ({
                              ...prev,
                              price:
                                e.target.value,
                            })
                          )
                        }
                      />

                      <input
                        placeholder="Emoji"
                        value={
                          newFood.emoji
                        }
                        onChange={(e) =>
                          setNewFood(
                            (prev) => ({
                              ...prev,
                              emoji:
                                e.target.value,
                            })
                          )
                        }
                      />

                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        placeholder="Rating"
                        value={
                          newFood.rating
                        }
                        onChange={(e) =>
                          setNewFood(
                            (prev) => ({
                              ...prev,
                              rating:
                                e.target.value,
                            })
                          )
                        }
                      />

                      <input
                        id="food-image-input"
                        type="file"
                        accept="image/*"
                        onChange={
                          handleImageUpload
                        }
                      />

                      {foodImagePreview && (
                        <img
                          src={
                            foodImagePreview
                          }
                          alt="Preview"
                          style={{
                            width:
                              "100%",
                            maxHeight:
                              180,
                            objectFit:
                              "cover",
                            borderRadius:
                              12,
                          }}
                        />
                      )}

                      <textarea
                        placeholder="Description"
                        value={
                          newFood.description
                        }
                        onChange={(e) =>
                          setNewFood(
                            (prev) => ({
                              ...prev,
                              description:
                                e.target.value,
                            })
                          )
                        }
                      />

                      <button
                        className="admin-primary-btn"
                        disabled={
                          actionLoading
                        }
                      >
                        Add Food
                      </button>

                    </form>

                  </div>

                </section>

                {/* LIVE MENU */}

                <div className="admin-panel">

                  <h2>
                    Live Menu (
                    {menu.length}
                    )
                  </h2>

                  {menu.length ? (
                    menu.map(
                      (item) => (
                        <div
                          className="admin-row"
                          key={item.id}
                        >

                          <span>
                            <b>
                              {item.name}
                            </b>

                            <small>
                              {item.category?.name ||
                                "-"}{" "}
                              • ₹
                              {
                                item.price
                              }
                            </small>
                          </span>

                          <button
                            type="button"
                            className="admin-danger-btn"
                            onClick={() =>
                              removeFood(
                                item.id
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            Delete
                          </button>

                        </div>
                      )
                    )
                  ) : (
                    <p>
                      No foods in
                      the database.
                    </p>
                  )}

                </div>

              </>
            )}

            {/* =================================================
                STUDENTS
            ================================================= */}

            {tab === "students" && (
              <div className="admin-panel">

                <h2>
                  Registered Students (
                  {students.length}
                  )
                </h2>

                {students.length ? (
                  students.map(
                    (student) => (
                      <div
                        className="admin-row"
                        key={
                          student.id
                        }
                      >

                        <span>

                          <b>
                            {student.name ||
                              student.username}
                          </b>

                          <small>
                            {
                              student.studentId
                            }{" "}
                            •{" "}
                            {
                              student.email
                            }{" "}
                            •{" "}
                            {
                              student.department
                            }{" "}
                            •{" "}
                            {
                              student.year
                            }
                          </small>

                        </span>

                        <button
                          type="button"
                          className="admin-danger-btn"
                          onClick={() =>
                            deleteStudent(
                              student.id
                            )
                          }
                          disabled={
                            actionLoading
                          }
                        >
                          Remove
                        </button>

                      </div>
                    )
                  )
                ) : (
                  <p>
                    No registered
                    students yet.
                  </p>
                )}

              </div>
            )}

            {/* =================================================
                EMPLOYEES
            ================================================= */}

            {tab === "employees" && (
              <section className="admin-content-grid">

                <div className="admin-panel">

                  <h2>
                    Create Employee
                  </h2>

                  <form
                    className="admin-form"
                    onSubmit={
                      addEmployee
                    }
                  >

                    {[
                      [
                        "name",
                        "Name",
                        "text",
                      ],
                      [
                        "employeeId",
                        "Employee ID",
                        "text",
                      ],
                      [
                        "username",
                        "Username",
                        "text",
                      ],
                      [
                        "email",
                        "Email",
                        "email",
                      ],
                      [
                        "phone",
                        "Phone",
                        "text",
                      ],
                      [
                        "password",
                        "Password",
                        "password",
                      ],
                    ].map(
                      ([
                        key,
                        placeholder,
                        type,
                      ]) => (
                        <input
                          key={key}
                          type={type}
                          placeholder={
                            placeholder
                          }
                          value={
                            newEmployee[
                              key
                            ]
                          }
                          onChange={(e) =>
                            setNewEmployee(
                              (prev) => ({
                                ...prev,
                                [key]:
                                  e.target
                                    .value,
                              })
                            )
                          }
                        />
                      )
                    )}

                    <button
                      className="admin-primary-btn"
                      disabled={
                        actionLoading
                      }
                    >
                      Create Employee
                    </button>

                  </form>

                </div>

                <div className="admin-panel">

                  <h2>
                    Employees (
                    {
                      employees.length
                    }
                    )
                  </h2>

                  {employees.length ? (
                    employees.map(
                      (employee) => (
                        <div
                          className="admin-row"
                          key={
                            employee.id
                          }
                        >

                          <span>

                            <b>
                              {
                                employee.name
                              }
                            </b>

                            <small>
                              {
                                employee.employeeId
                              }{" "}
                              •{" "}
                              {
                                employee.username
                              }

                              {employee.email
                                ? ` • ${employee.email}`
                                : ""}
                            </small>

                          </span>

                          <button
                            type="button"
                            className="admin-danger-btn"
                            onClick={() =>
                              removeEmployee(
                                employee.id
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            Delete
                          </button>

                        </div>
                      )
                    )
                  ) : (
                    <p>
                      No employees
                      created yet.
                    </p>
                  )}

                </div>

              </section>
            )}

            {/* =================================================
                ORDERS
            ================================================= */}

            {tab === "orders" && (
              <div className="admin-panel">

                <h2>
                  Order Management (
                  {orders.length}
                  )
                </h2>

                {orders.length ? (
                  <div className="admin-orders-list">

                    {orders.map(
                      (order) => (
                        <div
                          className="admin-order-card"
                          key={
                            order.id
                          }
                        >

                          {/* ORDER HEADER */}

                          <div className="admin-order-main">

                            <div>

                              <span className="admin-order-token">
                                {
                                  order.tokenNumber
                                }
                              </span>

                              <h3>
                                {
                                  order.user
                                    ?.name ||
                                  "Student"
                                }
                              </h3>

                              <p>
                                Student ID:{" "}
                                {
                                  order.user
                                    ?.studentId ||
                                  "-"
                                }
                              </p>

                              <small>
                                ₹
                                {Number(
                                  order.totalAmount ||
                                    0
                                ).toFixed(
                                  2
                                )}{" "}
                                •{" "}
                                {order.orderDate
                                  ? new Date(
                                      order.orderDate
                                    ).toLocaleString()
                                  : "-"}
                              </small>

                            </div>

                            <span
                              className={`order-status status-${String(
                                order.status ||
                                  ""
                              ).toLowerCase()}`}
                            >
                              {
                                order.status
                              }
                            </span>

                          </div>

                          {/* CONTROLS */}

                          <div className="admin-order-controls">

                            {/* ASSIGN EMPLOYEE */}

                            <label>

                              <span>
                                Assign Employee
                              </span>

                              <select
                                value={
                                  order
                                    .assignedEmployee
                                    ?.id ||
                                  ""
                                }
                                onChange={(
                                  e
                                ) =>
                                  assignEmployee(
                                    order.id,
                                    e.target
                                      .value
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                              >

                                <option value="">
                                  Unassigned
                                </option>

                                {employees.map(
                                  (
                                    employee
                                  ) => (
                                    <option
                                      key={
                                        employee.id
                                      }
                                      value={
                                        employee.id
                                      }
                                    >
                                      {
                                        employee.name
                                      }{" "}
                                      (
                                      {
                                        employee.employeeId
                                      }
                                      )
                                    </option>
                                  )
                                )}

                              </select>

                            </label>

                            {/* STATUS */}

                            <label>

                              <span>
                                Order Status
                              </span>

                              <select
                                value={
                                  order.status ||
                                  "PLACED"
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateOrderStatus(
                                    order.id,
                                    e.target
                                      .value
                                  )
                                }
                                disabled={
                                  actionLoading
                                }
                              >

                                {ORDER_STATUSES.map(
                                  (
                                    status
                                  ) => (
                                    <option
                                      key={
                                        status
                                      }
                                      value={
                                        status
                                      }
                                    >
                                      {
                                        status
                                      }
                                    </option>
                                  )
                                )}

                              </select>

                            </label>

                          </div>

                          {/* ASSIGNED EMPLOYEE */}

                          <div className="admin-assigned-info">

                            👨‍🍳 Assigned to:{" "}

                            <strong>
                              {
                                order
                                  .assignedEmployee
                                  ?.name ||
                                "Not assigned yet"
                              }
                            </strong>

                          </div>

                        </div>
                      )
                    )}

                  </div>
                ) : (
                  <div className="admin-empty-state">

                    <div>
                      📦
                    </div>

                    <h3>
                      No orders yet
                    </h3>

                    <p>
                      Student orders
                      will appear
                      here after
                      checkout.
                    </p>

                  </div>
                )}

              </div>
            )}

          </>
        )}

      </main>

    </div>
  );
}

export default AdminDashboard;
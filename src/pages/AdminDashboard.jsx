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

const emptyCategory = {
  name: "",
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

const emptyStudent = {
  name: "",
  studentId: "",
  email: "",
  phone: "",
  department: "",
  year: "",
};

function AdminDashboard() {
  const [tab, setTab] = useState("overview");

  // =====================================================
  // DATABASE DATA
  // =====================================================

  const [stats, setStats] = useState(null);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [orders, setOrders] = useState([]);

  // =====================================================
  // CREATE FORMS
  // =====================================================

  const [newFood, setNewFood] = useState(emptyFood);

  const [newCategory, setNewCategory] =
    useState(emptyCategory);

  const [newEmployee, setNewEmployee] =
    useState(emptyEmployee);

  // =====================================================
  // IMAGE
  // =====================================================

  const [foodImagePreview, setFoodImagePreview] =
    useState("");

  // =====================================================
  // UPDATE STATES
  // =====================================================

  const [editingFood, setEditingFood] =
    useState(null);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [editingStudent, setEditingStudent] =
    useState(null);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] =
    useState(true);

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
                ).toUpperCase() ===
                "STUDENT"
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

  useEffect(() => {
    loadAll();
  }, []);

  // =====================================================
  // COMPUTED STATS
  // =====================================================

  const computedStats = useMemo(
    () => ({
      orders: orders.length,

      students: students.length,

      employees: employees.length,

      menu: menu.length,

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

  const handleImageUpload = (event) => {
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

      setFoodImagePreview(image);
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // CATEGORY - CREATE
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

      setNewCategory(
        emptyCategory
      );
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
  // CATEGORY - START EDIT
  // =====================================================

  const startEditCategory = (
    category
  ) => {
    setEditingCategory({
      id: category.id,
      name: category.name || "",
      description:
        category.description || "",
    });
  };

  // =====================================================
  // CATEGORY - UPDATE
  // =====================================================

  const updateCategory = async (
    event
  ) => {
    event.preventDefault();

    if (
      !editingCategory?.name?.trim()
    ) {
      alert(
        "Category name is required."
      );
      return;
    }

    try {
      setActionLoading(true);

      const updated =
        await api.updateCategory(
          editingCategory.id,
          {
            name:
              editingCategory.name.trim(),

            description:
              (
                editingCategory
                  .description || ""
              ).trim(),
          }
        );

      setCategories(
        (prev) =>
          prev.map(
            (category) =>
              category.id ===
              editingCategory.id
                ? {
                    ...category,
                    ...(updated ||
                      editingCategory),
                  }
                : category
          )
      );

      setEditingCategory(null);
    } catch (err) {
      alert(
        err.message ||
          "Unable to update category."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // CATEGORY - DELETE
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
  // FOOD - CREATE
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
            Number(newFood.price),

          image:
            newFood.image || "",

          emoji:
            newFood.emoji ||
            "🍽️",

          rating:
            Number(
              newFood.rating || 4.5
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

      setNewFood(emptyFood);
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
  // FOOD - START EDIT
  // =====================================================

  const startEditFood = (
    item
  ) => {
    setEditingFood({
      id: item.id,

      name:
        item.name || "",

      categoryId:
        item.category?.id
          ? String(
              item.category.id
            )
          : "",

      price:
        item.price ?? "",

      image:
        item.image || "",

      emoji:
        item.emoji || "🍽️",

      rating:
        item.rating ?? 4.5,

      description:
        item.description || "",
    });
  };

  // =====================================================
  // FOOD - UPDATE
  // =====================================================

  const updateFood = async (
    event
  ) => {
    event.preventDefault();

    if (
      !editingFood?.name?.trim() ||
      !editingFood?.price ||
      !editingFood?.categoryId
    ) {
      alert(
        "Food name, category and price are required."
      );
      return;
    }

    try {
      setActionLoading(true);

      const payload = {
        name:
          editingFood.name.trim(),

        price:
          Number(editingFood.price),

        image:
          editingFood.image || "",

        emoji:
          editingFood.emoji ||
          "🍽️",

        rating:
          Number(
            editingFood.rating || 4.5
          ),

        description:
          (
            editingFood.description ||
            ""
          ).trim(),

        category: {
          id:
            Number(
              editingFood.categoryId
            ),
        },
      };

      const updated =
        await api.updateMenuItem(
          editingFood.id,
          payload
        );

      setMenu(
        (prev) =>
          prev.map(
            (item) =>
              item.id ===
              editingFood.id
                ? {
                    ...item,
                    ...payload,
                    ...(updated || {}),
                  }
                : item
          )
      );

      setEditingFood(null);
    } catch (err) {
      alert(
        err.message ||
          "Unable to update food."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // FOOD - DELETE
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
  // EMPLOYEE - CREATE
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
  // EMPLOYEE - START EDIT
  // =====================================================

  const startEditEmployee = (
    employee
  ) => {
    setEditingEmployee({
      id: employee.id,

      name:
        employee.name || "",

      employeeId:
        employee.employeeId || "",

      username:
        employee.username || "",

      password: "",

      email:
        employee.email || "",

      phone:
        employee.phone || "",
    });
  };

  // =====================================================
  // EMPLOYEE - UPDATE
  // =====================================================

  const updateEmployee = async (
    event
  ) => {
    event.preventDefault();

    if (
      !editingEmployee?.name?.trim() ||
      !editingEmployee?.employeeId?.trim() ||
      !editingEmployee?.username?.trim()
    ) {
      alert(
        "Name, Employee ID and username are required."
      );
      return;
    }

    try {
      setActionLoading(true);

      const payload = {
        name:
          editingEmployee.name.trim(),

        employeeId:
          editingEmployee.employeeId.trim(),

        username:
          editingEmployee.username.trim(),

        email:
          editingEmployee.email.trim() ||
          null,

        phone:
          editingEmployee.phone.trim() ||
          null,
      };

      /*
       * Only send password if admin
       * entered a new password.
       */
      if (
        editingEmployee.password
      ) {
        payload.password =
          editingEmployee.password;
      }

      const updated =
        await api.updateEmployee(
          editingEmployee.id,
          payload
        );

      setEmployees(
        (prev) =>
          prev.map(
            (employee) =>
              employee.id ===
              editingEmployee.id
                ? {
                    ...employee,
                    ...payload,
                    ...(updated || {}),
                  }
                : employee
          )
      );

      setEditingEmployee(null);
    } catch (err) {
      alert(
        err.message ||
          "Unable to update employee."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // EMPLOYEE - DELETE
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
  // STUDENT - START EDIT
  // =====================================================

  const startEditStudent = (
    student
  ) => {
    setEditingStudent({
      id: student.id,

      name:
        student.name ||
        student.username ||
        "",

      studentId:
        student.studentId || "",

      email:
        student.email || "",

      phone:
        student.phone || "",

      department:
        student.department || "",

      year:
        student.year || "",
    });
  };

  // =====================================================
  // STUDENT - UPDATE
  // =====================================================

  const updateStudent = async (
    event
  ) => {
    event.preventDefault();

    if (
      !editingStudent?.name?.trim() ||
      !editingStudent?.studentId?.trim()
    ) {
      alert(
        "Student name and Student ID are required."
      );
      return;
    }

    try {
      setActionLoading(true);

      const payload = {
        name:
          editingStudent.name.trim(),

        studentId:
          editingStudent.studentId.trim(),

        email:
          editingStudent.email.trim(),

        phone:
          editingStudent.phone.trim(),

        department:
          editingStudent.department,

        year:
          editingStudent.year,
      };

      const updated =
        await api.updateUser(
          editingStudent.id,
          payload
        );

      setStudents(
        (prev) =>
          prev.map(
            (student) =>
              student.id ===
              editingStudent.id
                ? {
                    ...student,
                    ...payload,
                    ...(updated || {}),
                  }
                : student
          )
      );

      setEditingStudent(null);
    } catch (err) {
      alert(
        err.message ||
          "Unable to update student."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =====================================================
  // STUDENT - DELETE
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
  // ORDER - ASSIGN EMPLOYEE
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

      const updated =
        await api.assignEmployee(
          orderId,
          Number(employeeId)
        );

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
  // ORDER - UPDATE STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setActionLoading(true);

      const updated =
        await api.updateOrderStatus(
          orderId,
          status
        );

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

        {/* TOPBAR */}

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

        {/* ERROR */}

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
                MENU MANAGEMENT
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
                        placeholder="Description"
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
                        type="submit"
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
                              {
                                category.description ||
                                "No description"
                              }
                            </small>
                          </span>

                          <div className="admin-row-actions">

                            <button
                              type="button"
                              className="admin-update-btn"
                              onClick={() =>
                                startEditCategory(
                                  category
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Update
                            </button>

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

                        </div>
                      )
                    )}

                  </div>

                  {/* FOOD CREATE */}

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
                        type="submit"
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
                          key={
                            item.id
                          }
                        >

                          <span>
                            <b>
                              {item.name}
                            </b>

                            <small>
                              {
                                item.category
                                  ?.name
                              }{" "}
                              • ₹
                              {
                                item.price
                              }
                            </small>
                          </span>

                          <div className="admin-row-actions">

                            <button
                              type="button"
                              className="admin-update-btn"
                              onClick={() =>
                                startEditFood(
                                  item
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Update
                            </button>

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

                        <div className="admin-row-actions">

                          <button
                            type="button"
                            className="admin-update-btn"
                            onClick={() =>
                              startEditStudent(
                                student
                              )
                            }
                            disabled={
                              actionLoading
                            }
                          >
                            Update
                          </button>

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

                {/* CREATE EMPLOYEE */}

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
                      type="submit"
                      className="admin-primary-btn"
                      disabled={
                        actionLoading
                      }
                    >
                      Create Employee
                    </button>

                  </form>

                </div>

                {/* EMPLOYEE LIST */}

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

                          <div className="admin-row-actions">

                            <button
                              type="button"
                              className="admin-update-btn"
                              onClick={() =>
                                startEditEmployee(
                                  employee
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              Update
                            </button>

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

                          <div className="admin-order-controls">

                            {/* ASSIGN */}

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

      {/* =====================================================
          CATEGORY UPDATE MODAL
      ===================================================== */}

      {editingCategory && (
        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>
                <span className="admin-badge">
                  UPDATE
                </span>

                <h2>
                  Update Category
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setEditingCategory(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            <form
              className="admin-form"
              onSubmit={
                updateCategory
              }
            >

              <input
                placeholder="Category name"
                value={
                  editingCategory.name
                }
                onChange={(e) =>
                  setEditingCategory(
                    (prev) => ({
                      ...prev,
                      name:
                        e.target.value,
                    })
                  )
                }
              />

              <textarea
                placeholder="Description"
                value={
                  editingCategory.description
                }
                onChange={(e) =>
                  setEditingCategory(
                    (prev) => ({
                      ...prev,
                      description:
                        e.target.value,
                    })
                  )
                }
              />

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() =>
                    setEditingCategory(
                      null
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-update-btn"
                  disabled={
                    actionLoading
                  }
                >
                  Update Category
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          FOOD UPDATE MODAL
      ===================================================== */}

      {editingFood && (
        <div className="admin-modal-overlay">

          <div className="admin-modal admin-modal-large">

            <div className="admin-modal-header">

              <div>
                <span className="admin-badge">
                  UPDATE
                </span>

                <h2>
                  Update Food
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setEditingFood(null)
                }
              >
                ×
              </button>

            </div>

            <form
              className="admin-form"
              onSubmit={updateFood}
            >

              <input
                placeholder="Food name"
                value={
                  editingFood.name
                }
                onChange={(e) =>
                  setEditingFood(
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
                  editingFood.categoryId
                }
                onChange={(e) =>
                  setEditingFood(
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
                  editingFood.price
                }
                onChange={(e) =>
                  setEditingFood(
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
                  editingFood.emoji
                }
                onChange={(e) =>
                  setEditingFood(
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
                  editingFood.rating
                }
                onChange={(e) =>
                  setEditingFood(
                    (prev) => ({
                      ...prev,
                      rating:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                placeholder="Image URL / image data"
                value={
                  editingFood.image
                }
                onChange={(e) =>
                  setEditingFood(
                    (prev) => ({
                      ...prev,
                      image:
                        e.target.value,
                    })
                  )
                }
              />

              <textarea
                placeholder="Description"
                value={
                  editingFood.description
                }
                onChange={(e) =>
                  setEditingFood(
                    (prev) => ({
                      ...prev,
                      description:
                        e.target.value,
                    })
                  )
                }
              />

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() =>
                    setEditingFood(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-update-btn"
                  disabled={
                    actionLoading
                  }
                >
                  Update Food
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          EMPLOYEE UPDATE MODAL
      ===================================================== */}

      {editingEmployee && (
        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>
                <span className="admin-badge">
                  UPDATE
                </span>

                <h2>
                  Update Employee
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setEditingEmployee(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            <form
              className="admin-form"
              onSubmit={
                updateEmployee
              }
            >

              <input
                placeholder="Name"
                value={
                  editingEmployee.name
                }
                onChange={(e) =>
                  setEditingEmployee(
                    (prev) => ({
                      ...prev,
                      name:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                placeholder="Employee ID"
                value={
                  editingEmployee.employeeId
                }
                onChange={(e) =>
                  setEditingEmployee(
                    (prev) => ({
                      ...prev,
                      employeeId:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                placeholder="Username"
                value={
                  editingEmployee.username
                }
                onChange={(e) =>
                  setEditingEmployee(
                    (prev) => ({
                      ...prev,
                      username:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={
                  editingEmployee.email
                }
                onChange={(e) =>
                  setEditingEmployee(
                    (prev) => ({
                      ...prev,
                      email:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                placeholder="Phone"
                value={
                  editingEmployee.phone
                }
                onChange={(e) =>
                  setEditingEmployee(
                    (prev) => ({
                      ...prev,
                      phone:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                type="password"
                placeholder="New password (optional)"
                value={
                  editingEmployee.password
                }
                onChange={(e) =>
                  setEditingEmployee(
                    (prev) => ({
                      ...prev,
                      password:
                        e.target.value,
                    })
                  )
                }
              />

              <small className="admin-form-hint">
                Leave password empty if
                you don't want to change it.
              </small>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() =>
                    setEditingEmployee(
                      null
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-update-btn"
                  disabled={
                    actionLoading
                  }
                >
                  Update Employee
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          STUDENT UPDATE MODAL
      ===================================================== */}

      {editingStudent && (
        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <div className="admin-modal-header">

              <div>
                <span className="admin-badge">
                  UPDATE
                </span>

                <h2>
                  Update Student
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() =>
                  setEditingStudent(
                    null
                  )
                }
              >
                ×
              </button>

            </div>

            <form
              className="admin-form"
              onSubmit={
                updateStudent
              }
            >

              <input
                placeholder="Student Name"
                value={
                  editingStudent.name
                }
                onChange={(e) =>
                  setEditingStudent(
                    (prev) => ({
                      ...prev,
                      name:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                placeholder="Student ID"
                value={
                  editingStudent.studentId
                }
                onChange={(e) =>
                  setEditingStudent(
                    (prev) => ({
                      ...prev,
                      studentId:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                type="email"
                placeholder="Email"
                value={
                  editingStudent.email
                }
                onChange={(e) =>
                  setEditingStudent(
                    (prev) => ({
                      ...prev,
                      email:
                        e.target.value,
                    })
                  )
                }
              />

              <input
                placeholder="Phone"
                value={
                  editingStudent.phone
                }
                onChange={(e) =>
                  setEditingStudent(
                    (prev) => ({
                      ...prev,
                      phone:
                        e.target.value,
                    })
                  )
                }
              />

              <select
                value={
                  editingStudent.department
                }
                onChange={(e) =>
                  setEditingStudent(
                    (prev) => ({
                      ...prev,
                      department:
                        e.target.value,
                    })
                  )
                }
              >

                <option value="">
                  Select Department
                </option>

                <option value="Information Technology">
                  Information Technology
                </option>

                <option value="Computer Science Engineering">
                  Computer Science Engineering
                </option>

                <option value="Electronics and Communication Engineering">
                  Electronics and Communication Engineering
                </option>

                <option value="Electrical and Electronics Engineering">
                  Electrical and Electronics Engineering
                </option>

                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>

                <option value="Civil Engineering">
                  Civil Engineering
                </option>

              </select>

              <select
                value={
                  editingStudent.year
                }
                onChange={(e) =>
                  setEditingStudent(
                    (prev) => ({
                      ...prev,
                      year:
                        e.target.value,
                    })
                  )
                }
              >

                <option value="">
                  Select Year
                </option>

                <option value="1st Year">
                  1st Year
                </option>

                <option value="2nd Year">
                  2nd Year
                </option>

                <option value="3rd Year">
                  3rd Year
                </option>

                <option value="4th Year">
                  4th Year
                </option>

              </select>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={() =>
                    setEditingStudent(
                      null
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-update-btn"
                  disabled={
                    actionLoading
                  }
                >
                  Update Student
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default AdminDashboard;
const MENU_KEY = "smartCanteenMenu";
const EMPLOYEE_KEY = "smartCanteenEmployees";
const STUDENT_KEY = "smartCanteenRegisteredUsers";

/* ===============================
   MENU
================================ */

export function getMenuItems() {
  try {
    const data =
      localStorage.getItem(MENU_KEY);

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch (error) {
    console.error(
      "Error loading menu:",
      error
    );

    return [];
  }
}

export function saveMenuItems(items) {

  localStorage.setItem(
    MENU_KEY,
    JSON.stringify(items)
  );

  window.dispatchEvent(
    new Event("menuUpdated")
  );
}

/* ===============================
   EMPLOYEES
================================ */

export function getEmployees() {

  try {

    const data =
      localStorage.getItem(
        EMPLOYEE_KEY
      );

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(
      "Error loading employees:",
      error
    );

    return [];
  }
}

export function saveEmployees(
  employees
) {

  localStorage.setItem(
    EMPLOYEE_KEY,
    JSON.stringify(employees)
  );

  window.dispatchEvent(
    new Event("employeesUpdated")
  );
}

/* ===============================
   STUDENTS
================================ */

export function getRegisteredStudents() {

  try {

    const data =
      localStorage.getItem(
        STUDENT_KEY
      );

    if (!data) {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed)
      ? parsed
      : [];

  } catch (error) {

    console.error(
      "Error loading students:",
      error
    );

    return [];
  }
}
// JSONPlaceholder gives a single "name" field and company.name.
// We normalize that into the shape our UI expects.
export function normalizeUser(raw) {
  const [firstName = "", ...rest] = (raw.name || "").split(" ");
  const lastName = rest.join(" ");
  return {
    id: raw.id,
    firstName,
    lastName,
    email: raw.email || "",
    department: raw.company?.name || "",
    _raw: raw,
  };
}

export function denormalizeUser(user) {
  return {
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    company: { name: user.department },
  };
}

export function validateUserForm(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required";
  if (!values.lastName.trim()) errors.lastName = "Last name is required";
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!values.department.trim()) errors.department = "Department is required";
  return errors;
}

import React, { useState } from "react";
import { validateUserForm } from "../utils/helpers";

export default function UserFormModal({
  initialUser,
  onSave,
  onClose,
  saving,
}) {
  const [values, setValues] = useState(
    initialUser || { firstName: "", lastName: "", email: "", department: "" }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateUserForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      onSave(values);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
      >
        <h3>{initialUser ? "Edit User" : "Add User"}</h3>

        <label>First Name</label>
        <input
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
        />
        {errors.firstName && (
          <span className="field-error">{errors.firstName}</span>
        )}

        <label>Last Name</label>
        <input
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
        />
        {errors.lastName && (
          <span className="field-error">{errors.lastName}</span>
        )}

        <label>Email</label>
        <input name="email" value={values.email} onChange={handleChange} />
        {errors.email && <span className="field-error">{errors.email}</span>}

        <label>Department</label>
        <input
          name="department"
          value={values.department}
          onChange={handleChange}
        />
        {errors.department && (
          <span className="field-error">{errors.department}</span>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from "react";

export default function FilterModal({ initialFilters, onApply, onClose }) {
  const [filters, setFilters] = useState(initialFilters);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    const cleared = {
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    };
    setFilters(cleared);
    onApply(cleared);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Filter Users</h3>

        <label>First Name</label>
        <input
          name="firstName"
          value={filters.firstName}
          onChange={handleChange}
          placeholder="e.g. John"
        />

        <label>Last Name</label>
        <input
          name="lastName"
          value={filters.lastName}
          onChange={handleChange}
          placeholder="e.g. Doe"
        />

        <label>Email</label>
        <input
          name="email"
          value={filters.email}
          onChange={handleChange}
          placeholder="e.g. john@example.com"
        />

        <label>Department</label>
        <input
          name="department"
          value={filters.department}
          onChange={handleChange}
          placeholder="e.g. Sales"
        />

        <div className="modal-actions">
          <button className="btn-secondary" onClick={handleClear}>
            Clear
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              onApply(filters);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

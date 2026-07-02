import React from "react";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
];

export default function UserTable({
  users,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
}) {
  const arrow = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? " ▲" : " ▼";
  };

  if (users.length === 0) {
    return <div className="empty-state">No users found.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th key={col.key} onClick={() => onSort(col.key)}>
                {col.label}
                {arrow(col.key)}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td data-label="ID">{user.id}</td>
              <td data-label="First Name">{user.firstName}</td>
              <td data-label="Last Name">{user.lastName}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Department">{user.department}</td>
              <td data-label="Actions">
                <button className="btn-link" onClick={() => onEdit(user)}>
                  Edit
                </button>
                <button
                  className="btn-link danger"
                  onClick={() => onDelete(user)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

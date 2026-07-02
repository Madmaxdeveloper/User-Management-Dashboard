import React, { useEffect, useMemo, useState } from "react";
import { fetchUsers, createUser, updateUser, deleteUser } from "./api/userApi";
import { normalizeUser, denormalizeUser } from "./utils/helpers";
import UserTable from "./components/UserTable";
import UserFormModal from "./components/UserFormModal";
import FilterModal from "./components/FilterModal";
import Pagination from "./components/Pagination";
import "./styles.css";

const EMPTY_FILTERS = {
  firstName: "",
  lastName: "",
  email: "",
  department: "",
};

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formModal, setFormModal] = useState({ open: false, user: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchUsers();
      setUsers(data.map(normalizeUser));
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const filteredSortedUsers = useMemo(() => {
    let result = [...users];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((u) =>
        [u.firstName, u.lastName, u.email, u.department]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }

    Object.keys(filters).forEach((key) => {
      const val = filters[key].trim().toLowerCase();
      if (val) {
        result = result.filter((u) =>
          (u[key] || "").toLowerCase().includes(val)
        );
      }
    });

    result.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [users, search, filters, sortConfig]);

  const totalPages = Math.ceil(filteredSortedUsers.length / pageSize) || 1;

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSortedUsers.slice(start, start + pageSize);
  }, [filteredSortedUsers, currentPage, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const openAddModal = () => setFormModal({ open: true, user: null });
  const openEditModal = (user) => setFormModal({ open: true, user });
  const closeFormModal = () => setFormModal({ open: false, user: null });

  const handleSaveUser = async (values) => {
    setSaving(true);
    setActionError("");
    try {
      if (formModal.user) {
        // Edit flow
        await updateUser(formModal.user.id, denormalizeUser(values));
        setUsers((prev) =>
          prev.map((u) =>
            u.id === formModal.user.id ? { ...u, ...values } : u
          )
        );
      } else {
        // Add flow — JSONPlaceholder simulates the response only,
        // so we generate a local ID to keep the UI consistent.
        await createUser(denormalizeUser(values));
        const newId =
          users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
        setUsers((prev) => [...prev, { id: newId, ...values }]);
      }
      closeFormModal();
    } catch (err) {
      setActionError(
        formModal.user ? "Failed to update user." : "Failed to add user."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.firstName} ${user.lastName}?`)) return;
    setActionError("");
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      setActionError("Failed to delete user.");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>User Management Dashboard</h1>
      </header>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button
          className="btn-secondary"
          onClick={() => setShowFilterModal(true)}
        >
          Filter
        </button>
        <button className="btn-primary" onClick={openAddModal}>
          + Add User
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}{" "}
          <button className="btn-link" onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}
      {actionError && <div className="error-banner">{actionError}</div>}

      {loading ? (
        <div className="loading-state">Loading users...</div>
      ) : (
        <>
          <UserTable
            users={paginatedUsers}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={openEditModal}
            onDelete={handleDeleteUser}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredSortedUsers.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </>
      )}

      {formModal.open && (
        <UserFormModal
          initialUser={formModal.user}
          onSave={handleSaveUser}
          onClose={closeFormModal}
          saving={saving}
        />
      )}

      {showFilterModal && (
        <FilterModal
          initialFilters={filters}
          onApply={(f) => {
            setFilters(f);
            setCurrentPage(1);
          }}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}

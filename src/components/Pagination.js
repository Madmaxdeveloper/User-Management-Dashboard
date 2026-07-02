import React from "react";

const LIMIT_OPTIONS = [10, 25, 50, 100];

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) {
  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}-
        {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt} / page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

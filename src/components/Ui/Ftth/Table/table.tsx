import React from "react";
import LimitSelect from "./LimitSelect";
import Pagination from "./Pagination";
import NoData from "./NoData";

interface Column<T> {
  header: string | (() => React.ReactNode);
  accessor: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  meta: Record<string, any>;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  noDataMessage?: string;
  paginationLabels?: {
    showing: string;
    to: string;
    of: string;
    results: string;
  };
}
const getAlignClass = (align?: "left" | "center" | "right") => {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-end";
    default:
      return "text-start";
  }
};
function DataTable<T extends Record<string, any>>({
  columns,
  data,
  defaultPageSize = 10,
  pageSizeOptions = [2, 5, 10, 20, 50],
  loading = false,
  meta,
  onPageChange,
  onLimitChange,
  noDataMessage = "No data available",
  paginationLabels = {
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
  },
}: DataTableProps<T>) {
  // Use meta from server-side pagination
  const currentPage = meta?.page || 1;
  const pageSize = meta?.limit || defaultPageSize;
  const totalItems = meta?.total || data.length;
  const totalPages = meta?.totalPages || 1;

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handlePageSizeChange = (size: number) => {
    onLimitChange(size);
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="w-full max-w-full flex flex-col bg-white dark:bg-gray-900 rounded-xl overflow-hidden h-auto min-h-[300px] justify-between">
      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border-collapse">
          {/* HEADER */}
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`
    px-6 py-4
    text-xs font-semibold uppercase tracking-wide
    text-gray-500 dark:text-gray-400
    ${getAlignClass(col.align)}
  `}
                >
                  {col.header instanceof Function ? col.header() : col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="bg-white dark:bg-gray-900">
            {loading ? (
              // Skeleton Loading State
              Array.from({ length: pageSize }).map((_, rowIndex) => (
                <tr
                  key={`skeleton-${rowIndex}`}
                  className="border-b border-gray-100 dark:border-gray-800 even:bg-gray-50/50 dark:even:bg-gray-800/20"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={`skeleton-cell-${rowIndex}-${colIndex}`}
                      className={`
                        px-6 py-4 text-sm
                        ${col.align === "right" ? "text-end" : ""}
                        ${col.align === "center" ? "text-center" : ""}
                      `}
                    >
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 dark:border-gray-800 even:bg-gray-50/50 dark:even:bg-gray-800/20 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`
                        px-6 py-4 text-sm text-gray-700 dark:text-gray-200
                        ${col.align === "right" ? "text-end" : ""}
                        ${col.align === "center" ? "text-center" : ""}
                      `}
                    >
                      {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  <NoData Description={noDataMessage} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-1">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 flex-wrap">
          <LimitSelect
            value={meta?.limit || 10}
            options={pageSizeOptions}
            onChange={handlePageSizeChange}
          />

          <span className="text-sm text-gray-600 dark:text-gray-400">
            {paginationLabels.showing}{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {startItem}
            </span>{" "}
            {paginationLabels.to}{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {endItem}
            </span>{" "}
            {paginationLabels.of}{" "}
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {meta?.total || totalItems}
            </span>{" "}
            {paginationLabels.results}
          </span>
        </div>

        {/* RIGHT SIDE */}
        <Pagination
          currentPage={meta?.page || currentPage}
          totalPages={meta?.totalPages || totalPages}
          onChange={handlePageChange}
          variant="modern"
        />
      </div>
    </div>
  );
}

export default DataTable;

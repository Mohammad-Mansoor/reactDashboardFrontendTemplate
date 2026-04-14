import React, { useMemo } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  variant?: "enterprise" | "modern" | "compact";
}

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
  variant = "modern",
}: PaginationProps) {
  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);

    return pages;
  }, [currentPage, totalPages]);

  // Always render pagination to keep UI layout stable, buttons will just be disabled if totalPages <= 1

  /* ===============================
     STYLE SYSTEM (LIGHT + DARK)
  =============================== */

  const styles = {
    enterprise: {
      wrapper: "gap-2",
      button: `
        h-8 w-8 rounded-lg border text-sm
         text-gray-700 border-gray-300
        hover:bg-primary2/10 hover:text-primary2
        dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700
        dark:hover:bg-primary2/20 dark:hover:text-white
        transition-all duration-200
      `,
      active: `
        bg-primary2 text-white border-primary2 shadow-md scale-105
        dark:bg-primary2 dark:text-white
      `,
    },
    modern: {
      wrapper: "gap-2",
      button: `
        h-8 w-8 rounded-full text-[14px]
        bg-gray-100 text-gray-700
        hover:bg-primary2/10 hover:text-primary2
        dark:bg-gray-800 dark:text-gray-300
        dark:hover:bg-primary2/20 dark:hover:text-white
        
        transition-all duration-300
      `,
      active: `
        bg-primary2 text-white shadow-lg scale-110
        dark:bg-primary2 dark:text-white
      `,
    },
    compact: {
      wrapper: "gap-1",
      button: `
        h-7 w-7 rounded-md border text-xs
        bg-white text-gray-700 border-gray-300
        hover:bg-primary2/10 hover:text-primary2
        dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700
        dark:hover:bg-primary2/20 dark:hover:text-white
        transition-all duration-200
      `,
      active: `
        bg-primary2 text-white border-primary2
        dark:bg-primary2 dark:text-white
      `,
    },
  };

  const selectedStyle = styles[variant];

  const baseButton =
    "flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div
      className={`flex items-center flex-wrap justify-center md:justify-end ${selectedStyle.wrapper}`}
    >
      {/* First */}
      <button
        onClick={() => onChange(1)}
        disabled={currentPage === 1}
        className={`${baseButton} ${selectedStyle.button}`}
      >
        <FaAngleDoubleLeft size={variant === "compact" ? 10 : 12} className="rtl:rotate-180" />
      </button>

      {/* Previous */}
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButton} ${selectedStyle.button}`}
      >
        <FaChevronLeft size={variant === "compact" ? 10 : 12} className="rtl:rotate-180" />
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className={`${baseButton} ${selectedStyle.button} ${
            currentPage === page ? selectedStyle.active : ""
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButton} ${selectedStyle.button}`}
      >
        <FaChevronRight size={variant === "compact" ? 10 : 12} className="rtl:rotate-180" />
      </button>

      {/* Last */}
      <button
        onClick={() => onChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${baseButton} ${selectedStyle.button}`}
      >
        <FaAngleDoubleRight size={variant === "compact" ? 10 : 12} className="rtl:rotate-180" />
      </button>
    </div>
  );
}
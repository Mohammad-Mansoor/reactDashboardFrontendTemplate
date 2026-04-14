import { useEffect, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa";

interface LimitSelectProps {
  value: number;
  options?: number[];
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export default function LimitSelect({
  value,
  options = [5, 10, 20, 50, 100],
  onChange,
  disabled = false,
  className = "",
  label = "",
}: LimitSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selectLimit = (limit: number) => {
    onChange(limit);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-2 text-sm ${className}`}
    >
      {/* Optional Label */}
      {label && (
        <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {label}:
        </span>
      )}

      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`
          flex items-center justify-between gap-3
          min-w-[110px]
          px-4 py-2
          rounded-sm
          border
          bg-white text-gray-700
          shadow-sm
          transition-all duration-200
          hover:bg-gray-50
          focus:outline-none focus:ring-1 focus:ring-primary2
          
          dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700
          dark:hover:bg-gray-700
          
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }
          ${isOpen ? "ring-2 ring-primary2 border-primary2" : "border-gray-300"}
        `}
      >
        <span className="font-medium">{value}</span>

        <span className="text-gray-500 dark:text-gray-400 text-xs transition-transform duration-200">
          {isOpen ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute end-0 bottom-full mb-2
            w-full
            rounded-sm
            border
            bg-white
            shadow-xl
            z-50
            overflow-hidden
            animate-fadeIn
            border-primary2 ring-4 ring-primary2/12
            dark:bg-gray-900 dark:border-gray-700
          "
        >
          <div className="max-h-56 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => selectLimit(option)}
                className={`
                  w-full flex items-center justify-between
                  px-4 py-2.5
                  text-start
                  transition-all duration-150
                  hover:bg-gray-100
                  dark:hover:bg-gray-800
                  
                  ${
                    value === option
                      ? "bg-primary2/10 text-primary2 font-medium dark:bg-primary2/20"
                      : "text-gray-700 dark:text-gray-200"
                  }
                `}
              >
                <span>{option} / page</span>

                {value === option && (
                  <FaCheck className="text-primary2 text-xs" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
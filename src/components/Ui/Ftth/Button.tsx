import React, { JSX } from "react";
import { FaSpinner } from "react-icons/fa"; // for loading spinner

interface ButtonProps {
  label?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  bg?: string;
  disabled?: boolean;
  isFillOnHover?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  success?: boolean;
  error?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  width?: string;
  height?: string;
}

function Button({
  label,
  onClick,
  bg = "bg-primary1", // Tailwind bg color class (e.g., bg-blue-500)
  disabled = false,
  isFillOnHover = false,
  className = "",
  type = "button",
  success = false,
  error = false,
  isLoading = false,
  icon,
  iconPosition = "left",
  width = "",
  height = "h-10",
}: ButtonProps): JSX.Element {
  // Base styles
  let baseClasses = `relative flex items-center justify-center gap-2 text-[13.5px] font-medium tracking-wide rounded-sm 
    transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]
    focus:outline-none focus:ring-2 focus:ring-opacity-40 focus:ring-offset-2
    ${width} ${height} px-4 py-2 max-w-full overflow-hidden`;

  // Default styles
  let colorClasses = "";

  if (isFillOnHover && !isLoading) {
    // Transparent with border, bg applied only on hover
    colorClasses = `${bg.replace("bg-", "border-")} text-${bg.replace(
      "bg-",
      ""
    )} border hover:${bg} hover:text-white hover:border-transparent bg-white/50 dark:bg-gray-900/50 backdrop-blur-md shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.15)]`;
  } else if (isFillOnHover && isLoading) {
    colorClasses = `${bg} text-white opacity-80 cursor-wait`;
  } else {
    // Solid button
    colorClasses = `${bg} text-white  shadow-[inset_0px_1px_0px_rgba(255,255,255,0.2),0_2px_6px_-2px_rgba(0,0,0,0.15)] hover:brightness-110 hover:shadow-[inset_0px_1px_0px_rgba(255,255,255,0.3),0_8px_16px_-4px_rgba(0,0,0,0.2)] ring-1 ring-black/5 dark:ring-white/10`;
  }

  // Success & Error overrides
  if (success)
    colorClasses = isFillOnHover
      ? "backdrop-blur-md border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:border-transparent hover:text-white bg-white/50 dark:bg-slate-900/50 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(16,185,129,0.3)]"
      : "bg-emerald-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_-2px_rgba(16,185,129,0.4)] hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_16px_-4px_rgba(16,185,129,0.5)] ring-1 ring-emerald-600/30";

  if (error)
    colorClasses = isFillOnHover
      ? "backdrop-blur-md border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:border-transparent hover:text-white bg-white/50 dark:bg-slate-900/50 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(244,63,94,0.3)]"
      : "bg-rose-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_-2px_rgba(244,63,94,0.4)] hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_16px_-4px_rgba(244,63,94,0.5)] ring-1 ring-rose-600/30";

  // Disabled override
  if (disabled)
    colorClasses =
      "bg-gray-100 text-gray-400 dark:bg-slate-800/80 dark:text-slate-500 cursor-not-allowed shadow-none border border-black/5 dark:border-white/5";

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${colorClasses} ${className}`}
    >
      {/* Loading spinner */}
      {isLoading && (
        <FaSpinner
          className={`shrink-0 animate-spin h-4 w-4 ${
            isFillOnHover ? " text-white" : "text-white"
          } `}
        />
      )}

      {/* Icon Left */}
      {!isLoading && icon && iconPosition === "left" && (
        <span className="shrink-0 flex items-center">{icon}</span>
      )}

      {/* Label */}
      {label && <span className="truncate min-w-0">{label}</span>}

      {/* Icon Right */}
      {!isLoading && icon && iconPosition === "right" && (
        <span className="shrink-0 flex items-center">{icon}</span>
      )}
    </button>
  );
}

export default Button;

import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export default function Spinner({
  size = "md",
  color = "text-primary2", // Primary color from your theme
  className = "",
}: SpinnerProps) {
  const sizeClasses =
    size === "sm"
      ? "w-5 h-5 border-2"
      : size === "lg"
      ? "w-12 h-12 border-[6px]"
      : "w-8 h-8 border-4"; // default md

  return (
    <div className="w-full min-h-[80px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary2"></div>
  </div>
  );
}


import React from "react";

interface TableBadgeProps {
  label: string;
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}

const TableBadge: React.FC<TableBadgeProps> = ({ label, variant = "neutral" }) => {
  const variants = {
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    error: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    neutral: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border
      ${variants[variant]}
    `}>
      <div className={`w-1 h-1 rounded-full ${variant === 'neutral' ? 'bg-slate-400' : `bg-current`}`} />
      {label}
    </span>
  );
};

export default TableBadge;

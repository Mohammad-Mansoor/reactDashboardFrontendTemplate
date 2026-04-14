
import React from "react";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  isCardView?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5, isCardView = false }) => {
  if (isCardView) {
    return (
      <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/5 w-full">
        {Array.from({ length: rows }).map((_, ridx) => (
          <div key={ridx} className="p-5 flex flex-col gap-4 bg-white dark:bg-transparent">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 animate-pulse" />
                   <div className="h-4 w-32 bg-slate-100 dark:bg-white/5 rounded-md animate-pulse" />
                </div>
                <div className="w-5 h-5 rounded bg-slate-100 dark:bg-white/5 animate-pulse" />
             </div>
             <div className="grid grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="space-y-2">
                    <div className="h-2 w-12 bg-slate-50 dark:bg-white/2 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-100 dark:bg-white/5 rounded animate-pulse" />
                 </div>
               ))}
             </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-slate-50 dark:border-white/5">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-5">
              <div className="flex items-center gap-3">
                {colIndex === 0 && (
                   <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 animate-pulse shrink-0" />
                )}
                <div className={`h-4 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse ${colIndex === 0 ? 'w-32' : 'w-24'}`} />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;

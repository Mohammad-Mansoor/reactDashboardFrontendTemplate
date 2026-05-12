import React, { useState, useMemo } from "react";
import { 
  Search, 
  ArrowUpDown, 
  Plus, 
  Download,
  Layers,
  Eye,
  Edit2,
  Trash2,
  Columns as ColumnsIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

// Ftth Components
import Button from "../Button";
import { SearchInputElement } from "../inputs";
import Checkbox from "../Checkbox";
import TableSkeleton from "./TableSkeleton";
import LimitSelect from "./LimitSelect";
import Pagination from "./Pagination";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface FTTHColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}

interface FTTHPremiumDataTableProps<T> {
  title: string;
  subtitle?: string;
  columns: FTTHColumn<T>[];
  visibleColumnKeys?: string[];
  onVisibleColumnsChange?: (keys: string[]) => void;
  data: T[];
  loading?: boolean;
  onAddClick?: () => void;
  onEditClick?: (row: T) => void;
  onDeleteClick?: (row: T) => void;
  onViewClick?: (row: T) => void;
  primaryActionLabel?: string;
  onSearchChange?: (query: string) => void;
  onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
  // Pagination
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  // Selection
  onSelectionChange?: (selectedIds: string[]) => void;
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function FTTHPremiumDataTable<T extends { id: string }>({
  title,
  subtitle,
  columns,
  visibleColumnKeys,
  onVisibleColumnsChange,
  data,
  loading = false,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onViewClick,
  primaryActionLabel = "Add New",
  onSearchChange,
  onExport,
  meta,
  onPageChange,
  onLimitChange,
  onSelectionChange
}: FTTHPremiumDataTableProps<T>) {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null }>({ key: '', direction: null });
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Filter columns based on visibility
  const displayedColumns = useMemo(() => {
    if (!visibleColumnKeys) return columns;
    return columns.filter(col => visibleColumnKeys.includes(col.key));
  }, [columns, visibleColumnKeys]);

  // Select all logic
  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? data.map(item => item.id) : [];
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedIds, id] 
      : selectedIds.filter(idx => idx !== id);
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key, direction });
  };

  const toggleColumn = (key: string) => {
    if (!visibleColumnKeys || !onVisibleColumnsChange) return;
    const newKeys = visibleColumnKeys.includes(key)
      ? visibleColumnKeys.filter(k => k !== key)
      : [...visibleColumnKeys, key];
    onVisibleColumnsChange(newKeys);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0c1221] border border-slate-100 dark:border-white/5 rounded-sm shadow-xl shadow-slate-200/40 dark:shadow-black/20 flex flex-col transition-all duration-500 relative">
      
      {/* 🟢 TOP BAR: Controls & Search */}
      <div className="p-4 md:p-6 flex flex-col gap-5 border-b border-slate-50 dark:border-white/5 bg-white dark:bg-transparent">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary1/10 flex items-center justify-center text-primary1 shrink-0">
               <Layers size={20} />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight line-clamp-1">{title}</h2>
              {subtitle && <p className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest line-clamp-1">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 lg:hidden">
             <Button 
                bg="bg-[#000]" 
                className="!w-10 !p-0 border border-slate-200 dark:border-white/10 !rounded-md !h-9 text-slate-800 dark:text-white"
                icon={<ColumnsIcon size={16} />}
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
             />
             <Button 
                bg="bg-primary1"
                className="!h-9 bg-primary1 text-white shadow-lg shadow-orange-500/20 !rounded-md !px-3"
                onClick={onAddClick}
                icon={<Plus size={18} />}
             />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative group w-full lg:max-w-md">
             <SearchInputElement 
               placeholder={t("actions.search")} 
               onChange={(e) => onSearchChange?.(e.target.value)}
               className="!rounded-md border-slate-200 focus:border-primary1 transition-all !h-10 text-xs w-full bg-slate-50 dark:bg-slate-900 border-solid"
             />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 no-scrollbar relative">
            <div className="hidden lg:block relative">
              <Button 
                  bg="bg-slate-500" 
                  className="border border-slate-200 dark:border-white/10 !rounded-md !h-10 text-slate-700 dark:text-white hover:bg-slate-600 dark:hover:bg-white/5 shadow-sm"
                  icon={<ColumnsIcon size={16} />}
                  label={<span className="text-[10px] font-black uppercase tracking-widest px-1">{t("actions.configure")}</span>}
                  onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              />
              <AnimatePresence>
                  {isColumnDropdownOpen && (
                      <>
                          <div className="fixed inset-0 z-[60]" onClick={() => setIsColumnDropdownOpen(false)} />
                          <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#141b2d] border border-slate-200 dark:border-white/10 rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] z-[70] p-2"
                          >
                              <div className="mb-2 px-3 py-1 text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] border-b border-slate-50 dark:border-white/5">{t("columns.display")}</div>
                              <div className="max-h-64 overflow-y-auto space-y-1">
                                  {columns.map(col => (
                                      <label key={col.key} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md cursor-pointer transition-colors">
                                          <Checkbox 
                                              value={visibleColumnKeys?.includes(col.key)} 
                                              onChange={() => toggleColumn(col.key)}
                                              size="sm"
                                          />
                                          <span className="text-[11px] font-bold text-slate-600 dark:text-white/60 tracking-tight">{col.header}</span>
                                      </label>
                                  ))}
                              </div>
                          </motion.div>
                      </>
                  )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:block relative">
              <Button 
                  bg="bg-slate-500" 
                  className="border border-slate-200 dark:border-white/10 !rounded-md !h-10 text-slate-700 dark:text-white hover:bg-slate-600 dark:hover:bg-white/5 shadow-sm"
                  icon={<Download size={16} />}
                  label={<span className="text-[10px] font-black uppercase tracking-widest px-1">{t("actions.export")}</span>}
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              />
              <AnimatePresence>
                  {isExportDropdownOpen && (
                      <>
                          <div className="fixed inset-0 z-[60]" onClick={() => setIsExportDropdownOpen(false)} />
                          <motion.div 
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#141b2d] border border-slate-200 dark:border-white/10 rounded-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] z-[70] p-1"
                          >
                               <button onClick={() => { onExport?.('pdf'); setIsExportDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-all uppercase tracking-widest text-start">
                                   <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {t("export.pdf")}
                               </button>
                               <button onClick={() => { onExport?.('excel'); setIsExportDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-all uppercase tracking-widest text-start">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {t("export.excel")}
                               </button>
                               <button onClick={() => { onExport?.('csv'); setIsExportDropdownOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/5 rounded-md transition-all uppercase tracking-widest text-start">
                                   <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {t("export.csv")}
                               </button>
                          </motion.div>
                      </>
                  )}
              </AnimatePresence>
            </div>

            {/* Mobile View Toggle Buttons */}
            <Button 
                bg="bg-[#000]"
                className="lg:hidden !h-10 text-slate-600 dark:text-white !rounded-md !px-4 border border-slate-200 dark:border-white/10"
                icon={<Download size={16} />}
                label={<span className="text-[10px] font-black uppercase tracking-widest">{t("actions.export")}</span>}
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
            />

            <Button 
              bg="bg-primary1"
              className="hidden lg:flex !rounded-md !h-10 bg-primary1 text-white shadow-[0_4px_14px_0_rgba(251,101,20,0.39)] hover:shadow-[0_6px_20px_rgba(251,101,20,0.23)] px-6 active:scale-95 transition-all"
              onClick={onAddClick}
              icon={<Plus size={18} />}
              label={<span className="text-[10px] font-black uppercase tracking-widest">{primaryActionLabel}</span>}
            />
          </div>
        </div>
      </div>

      {/* 🔵 TABLE CORE (Desktop View) */}
      <div className="hidden lg:block overflow-x-auto relative scrollbar-thin rounded-b-sm overflow-hidden">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="sticky top-0 z-20 bg-white/80 dark:bg-[#0c1221]/80 backdrop-blur-md">
            <tr className="border-b border-slate-50 dark:border-white/5">
              <th className="px-8 py-5 w-12 text-center">
                <Checkbox 
                  value={data.length > 0 && selectedIds.length === data.length} 
                  onChange={handleSelectAll}
                  size="sm"
                />
              </th>
              {displayedColumns.map((col) => (
                <th 
                  key={col.key} 
                  className={`
                    px-6 py-5 
                    text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.25em] relative
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                >
                  <div className={`flex items-center gap-2 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    {col.header}
                    {col.sortable && (
                      <button 
                        onClick={() => handleSort(col.key)}
                        className={`hover:text-primary1 transition-colors ${sortConfig.key === col.key ? 'text-primary1' : ''}`}
                      >
                        <ArrowUpDown size={12} />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-8 py-5 text-end w-36 text-[9px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.25em]">{t("actions.actions_label")}</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-50 dark:divide-white/5">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <TableSkeleton columns={displayedColumns.length + 1} />
              ) : data.length > 0 ? (
                data.map((row, idx) => (
                  <motion.tr 
                    key={row.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`
                      group transition-all duration-300 cursor-pointer
                      ${selectedIds.includes(row.id) ? 'bg-orange-500/5 shadow-[inset_4px_0_0_0_#fb6514]' : 'hover:bg-slate-50/50 dark:hover:bg-white/2'}
                    `}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
                      handleSelectRow(row.id, !selectedIds.includes(row.id));
                    }}
                  >
                    <td className="px-8 py-5">
                      <Checkbox 
                        value={selectedIds.includes(row.id)} 
                        onChange={(val) => handleSelectRow(row.id, val)}
                        size="sm"
                      />
                    </td>
                    {displayedColumns.map((col) => (
                      <td 
                        key={col.key} 
                        className={`
                          px-6 py-4 transition-transform group-hover:translate-x-1 duration-300
                          ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                        `}
                      >
                        <div className="text-[12.5px] font-bold text-slate-700 dark:text-white/80 tracking-tight">
                          {col.render ? col.render(row[col.key as keyof T], row) : (row[col.key as keyof T] as unknown as React.ReactNode)}
                        </div>
                      </td>
                    ))}
                    <td className="px-8 py-5 text-right">
                       <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button onClick={(e) => { e.stopPropagation(); onViewClick?.(row); }} className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all">
                             <Eye size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onEditClick?.(row); }} className="p-2 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all">
                             <Edit2 size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); onDeleteClick?.(row); }} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={displayedColumns.length + 2} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-200 dark:text-white/10">
                           <Search size={40} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[14px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">{t("empty.no_results")}</p>
                          <p className="text-xs text-slate-400/60 dark:text-white/10 font-medium">{t("empty.try_adjusting")}</p>
                        </div>
                        <button className="text-[11px] font-black text-primary1 uppercase tracking-widest hover:underline mt-2 italic cursor-pointer">{t("actions.clear_all")}</button>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="lg:hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5 bg-slate-50/50 dark:bg-transparent border-b border-slate-100 dark:border-white/5">
        <AnimatePresence mode="popLayout">
           {isColumnDropdownOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white dark:bg-[#141b2d] px-4 shadow-inner"
              >
                  <div className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 mb-2">Display Manager</div>
                  <div className="grid grid-cols-2 gap-2 pb-4">
                     {columns.map(col => (
                        <label key={col.key} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-white/5 rounded-md border border-slate-100 dark:border-white/5">
                           <Checkbox value={visibleColumnKeys?.includes(col.key)} onChange={() => toggleColumn(col.key)} size="sm" />
                           <span className="text-[10px] font-bold text-slate-600 dark:text-white/60">{col.header}</span>
                        </label>
                     ))}
                  </div>
              </motion.div>
           )}

           {isExportDropdownOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-white dark:bg-[#141b2d] px-4 shadow-inner"
              >
                  <div className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200/50 mb-2">Generate Report</div>
                  <div className="grid grid-cols-3 gap-2 pb-4">
                      <button onClick={() => { onExport?.('pdf'); setIsExportDropdownOpen(false); }} className="flex flex-col items-center gap-1 p-3 bg-red-50 dark:bg-red-500/10 rounded-md border border-red-100 dark:border-red-500/20">
                         <span className="w-2 h-2 rounded-full bg-red-400" />
                         <span className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase tracking-tighter">{t("export.pdf").split(' ')[0]}</span>
                      </button>
                      <button onClick={() => { onExport?.('excel'); setIsExportDropdownOpen(false); }} className="flex flex-col items-center gap-1 p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-md border border-emerald-100 dark:border-emerald-500/20">
                         <span className="w-2 h-2 rounded-full bg-emerald-400" />
                         <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-tighter">{t("export.excel").split(' ')[0]}</span>
                      </button>
                      <button onClick={() => { onExport?.('csv'); setIsExportDropdownOpen(false); }} className="flex flex-col items-center gap-1 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-md border border-blue-100 dark:border-blue-500/20">
                         <span className="w-2 h-2 rounded-full bg-blue-400" />
                         <span className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-tighter">{t("export.csv").split(' ')[0]}</span>
                      </button>
                  </div>
              </motion.div>
           )}
           {loading ? (
             <TableSkeleton columns={2} rows={5} isCardView />
           ) : data.length > 0 ? (
             data.map((row, idx) => (
                <motion.div 
                  key={row.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-5 flex flex-col gap-4 ${selectedIds.includes(row.id) ? 'bg-orange-500/5 shadow-[inset_4px_0_0_0_#fb6514]' : 'active:bg-slate-50'}`}
                  onClick={() => handleSelectRow(row.id, !selectedIds.includes(row.id))}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-3 flex-1 overflow-hidden">
                       {displayedColumns.slice(0, 1).map(col => (
                         <div key={col.key} className="contents">
                            {col.render ? col.render(row[col.key as keyof T], row) : (row[col.key as keyof T] as unknown as React.ReactNode)}
                         </div>
                       ))}
                    </div>
                    <Checkbox value={selectedIds.includes(row.id)} onChange={(val) => handleSelectRow(row.id, val)} />
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                     {displayedColumns.slice(1).map(col => (
                       <div key={col.key} className="flex flex-col gap-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest uppercase">{col.header}</span>
                          <div className="text-xs font-bold text-slate-700 dark:text-white/80">
                             {col.render ? col.render(row[col.key as keyof T], row) : (row[col.key as keyof T] as unknown as React.ReactNode)}
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 dark:border-white/5 pt-4 mt-1">
                     <span className="text-[9px] font-black text-primary1 uppercase tracking-widest">#{row.id}</span>
                     <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); onViewClick?.(row); }} className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 active:bg-blue-100 active:text-blue-500">
                          <Eye size={18} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onEditClick?.(row); }} className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 active:bg-amber-100 active:text-amber-500">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteClick?.(row); }} className="p-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 active:bg-red-100 active:text-red-500">
                          <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
                </motion.div>
             ))
           ) : (
             <div className="py-20 text-center px-6">
                <Search className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Matches</p>
             </div>
           )}
        </AnimatePresence>
      </div>

      {/* 🔴 FOOTER & PAGINATION */}
      {meta && (
        <div className="p-5 md:px-8 md:py-6 flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-slate-50 dark:border-white/5 bg-slate-50/20 dark:bg-white/1">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full lg:w-auto">
             <div className="flex items-center justify-between md:justify-start gap-4 w-full md:w-auto">
               <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest whitespace-nowrap">{t("pagination.limit")}</span>
               <LimitSelect 
                 value={meta.limit} 
                 onChange={(val) => onLimitChange?.(val)}
                 options={[2, 5, 10, 25, 50]}
               />
             </div>
             <div className="hidden md:block h-4 w-px bg-slate-100 dark:bg-white/10" />
             <p className="text-[11px] font-bold text-slate-500 dark:text-white/40 tracking-tight">
                {t("pagination.showing")} <span className="text-slate-900 dark:text-white font-black">{(meta.page - 1) * meta.limit + 1}</span>-
                <span className="text-slate-900 dark:text-white font-black">{Math.min(meta.page * meta.limit, meta.total)}</span> {t("pagination.of")} 
                <span className="text-slate-900 dark:text-white font-black">{meta.total}</span>
             </p>
          </div>

          <div className="w-full lg:w-auto flex justify-center">
            <Pagination 
              currentPage={meta.page} 
              totalPages={meta.totalPages} 
              onChange={(p) => onPageChange?.(p)}
              variant="modern"
            />
          </div>
        </div>
      )}
    </div>
  );
}


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { X, SlidersHorizontal, RotateCcw, CheckCircle2, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

// Ftth Component Library
import Button from "../Button";
import Checkbox from "../Checkbox";
import Switch from "../Switch";
import Tooltip from "../Tooltip";
import { InputElement } from "../inputs";
import SingleSelect from "../selectElements";
import MultiSelect from "../MultiSelectElement";

/* ─── Types & Configuration ────────────────────────────────────────────── */

export type FilterType = "dropdown" | "checkbox" | "range" | "date" | "date-range" | "toggle";

export interface FilterOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  multiSelect?: boolean;
  options?: FilterOption[];
  min?: number;
  max?: number;
  unit?: string;
  placeholder?: string;
  info?: string;
}

interface FTTHAdvanceFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (values: Record<string, any>) => void;
  filterConfig: FilterConfig[];
  initialValues?: Record<string, any>;
  title?: string;
}

/* ─── Sub-Components ────────────────────────────────────────────────────── */

const SectionLabel = ({ children, info }: { children: React.ReactNode; info?: string }) => (
  <div className="flex items-center justify-between mb-2">
    <h4 className="text-[12px] font-bold text-slate-700 dark:text-white/80 uppercase tracking-widest flex items-center gap-2">
       <div className="w-1.5 h-1.5 rounded-full bg-primary1/40" />
       {children}
    </h4>
    {info && (
      <Tooltip text={info}>
         <div className="cursor-help text-slate-400 hover:text-primary1 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
         </div>
      </Tooltip>
    )}
  </div>
);

/* ─── Main Component ────────────────────────────────────────────────────── */

const FTTHAdvanceFilterModal: React.FC<FTTHAdvanceFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  filterConfig = [],
  initialValues = {},
  title,
}) => {
  const { t } = useTranslation();
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});

  // Sync initial values
  useEffect(() => {
    if (!isOpen) return;

    const defaults: Record<string, any> = {};
    filterConfig.forEach((config) => {
      if (initialValues[config.key] !== undefined) {
        defaults[config.key] = initialValues[config.key];
      } else {
        switch (config.type) {
          case "checkbox":
          case "dropdown":
            defaults[config.key] = config.multiSelect ? [] : null;
            break;
          case "range":
            defaults[config.key] = { min: config.min ?? 0, max: config.max ?? 100 };
            break;
          case "date":
            defaults[config.key] = "";
            break;
          case "date-range":
            defaults[config.key] = { start: "", end: "" };
            break;
          case "toggle":
            defaults[config.key] = false;
            break;
        }
      }
    });
    setFilterValues(defaults);
  }, [isOpen, filterConfig, initialValues]);

  const handleValueChange = useCallback((key: string, value: any) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    const resetValues: Record<string, any> = {};
    filterConfig.forEach((config) => {
      switch (config.type) {
        case "checkbox":
        case "dropdown":
          resetValues[config.key] = config.multiSelect ? [] : null;
          break;
        case "range":
          resetValues[config.key] = { min: config.min ?? 0, max: config.max ?? 100 };
          break;
        default:
          resetValues[config.key] = "";
      }
    });
    setFilterValues(resetValues);
  }, [filterConfig]);

  const handleApply = useCallback(() => {
    onApply(filterValues);
    onClose();
  }, [filterValues, onApply, onClose]);

  const isChanged = useMemo(() => {
     return Object.keys(filterValues).length > 0;
  }, [filterValues]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9999] bg-slate-900/40 dark:bg-black/60 backdrop-blur-[6px] flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal Container - Lighter Borders & Shadows */}
            <motion.div
              className="relative w-full md:w-[70%] max-w-xl bg-white dark:bg-[#0c1221] rounded-sm shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col max-h-[85vh]"
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header - More Subtle */}
              <div className="px-6 py-5 border-b border-slate-50 dark:border-white/5 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-sm bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary2">
                    <SlidersHorizontal size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                      {title || t("advanceFilter.title", "Filters")}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body - Tighter Gaps */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
                {filterConfig.map((config, idx) => (
                  <motion.div
                    key={config.key}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <SectionLabel>{config.label}</SectionLabel>
                    
                    <div className="mt-1">
                      {/* Dropdown Type */}
                      {config.type === "dropdown" && (
                        config.multiSelect ? (
                          <MultiSelect
                            items={config.options}
                            placeholder={config.placeholder}
                            initialSelected={filterValues[config.key]}
                            onChange={(val) => handleValueChange(config.key, val)}
                          />
                        ) : (
                          <SingleSelect
                            items={config.options || []}
                            placeholder={config.placeholder}
                            initialSelected={filterValues[config.key]}
                            onChange={(val) => handleValueChange(config.key, val)}
                          />
                        )
                      )}

                      {/* Checkbox Type */}
                      {config.type === "checkbox" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/50 dark:bg-white/5 p-3 rounded-xl border border-slate-50 dark:border-white/5">
                          {config.options?.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group/item hover:bg-white dark:hover:bg-white/5 p-1.5 rounded-lg transition-all border border-transparent">
                              <Checkbox
                                value={(filterValues[config.key] as any[])?.includes(opt.value)}
                                onChange={() => {
                                  const current = (filterValues[config.key] as any[]) || [];
                                  const newValue = current.includes(opt.value)
                                    ? current.filter(v => v !== opt.value)
                                    : [...current, opt.value];
                                  handleValueChange(config.key, newValue);
                                }}
                                size="sm"
                              />
                              <span className="text-[13px] font-medium text-slate-600 dark:text-white/60 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Range Type */}
                      {config.type === "range" && (
                        <div className="grid grid-cols-2 gap-3">
                          <InputElement
                            label="Min"
                            type="number"
                            placeholder="0"
                            value={filterValues[config.key]?.min}
                            onChange={(e) => handleValueChange(config.key, { ...filterValues[config.key], min: Number(e.target.value) })}
                            rightIcon={config.unit ? <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{config.unit}</span> : null}
                            className="!h-9"
                          />
                          <InputElement
                            label="Max"
                            type="number"
                            placeholder="100"
                            value={filterValues[config.key]?.max}
                            onChange={(e) => handleValueChange(config.key, { ...filterValues[config.key], max: Number(e.target.value) })}
                            rightIcon={config.unit ? <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{config.unit}</span> : null}
                            className="!h-9"
                          />
                        </div>
                      )}

                      {/* Date Types */}
                      {(config.type === "date" || config.type === "date-range") && (
                        <div className="space-y-3">
                          <div className={config.type === "date-range" ? "grid grid-cols-2 gap-3" : ""}>
                            {config.type === "date" ? (
                               <InputElement
                                 type="date"
                                 value={filterValues[config.key]}
                                 onChange={(e) => handleValueChange(config.key, e.target.value)}
                                 leftIcon={<CalendarDays size={14} className="text-slate-400" />}
                                 className="!h-9"
                               />
                            ) : (
                              <>
                                <InputElement
                                  type="date"
                                  label="From"
                                  value={filterValues[config.key]?.start}
                                  onChange={(e) => handleValueChange(config.key, { ...filterValues[config.key], start: e.target.value })}
                                  leftIcon={<CalendarDays size={14} className="text-slate-400" />}
                                  className="!h-9"
                                />
                                <InputElement
                                  type="date"
                                  label="To"
                                  value={filterValues[config.key]?.end}
                                  onChange={(e) => handleValueChange(config.key, { ...filterValues[config.key], end: e.target.value })}
                                  leftIcon={<CalendarDays size={14} className="text-slate-400" />}
                                  className="!h-9"
                                />
                              </>
                            )}
                          </div>
                          
                           {config.type === "date-range" && (
                            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-50 dark:border-white/5 pt-2">
                               {['Today', 'Last 7 Days', 'Last Month'].map((rangeName) => (
                                 <button
                                   key={rangeName}
                                   type="button"
                                   onClick={() => {
                                      const now = new Date();
                                      // Using locales 'en-CA' gives us YYYY-MM-DD reliably
                                      const end = now.toLocaleDateString('en-CA');
                                      let start = end;

                                      if (rangeName === 'Last 7 Days') {
                                        const d = new Date();
                                        d.setDate(d.getDate() - 7);
                                        start = d.toLocaleDateString('en-CA');
                                      } else if (rangeName === 'Last Month') {
                                        const d = new Date();
                                        d.setMonth(d.getMonth() - 1);
                                        start = d.toLocaleDateString('en-CA');
                                      }
                                      
                                      console.log(`Setting range ${rangeName}:`, { start, end });
                                      handleValueChange(config.key, { start, end });
                                   }}
                                   className="px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:bg-primary1/10 hover:text-primary1 transition-all active:scale-95"
                                 >
                                   {rangeName}
                                 </button>
                               ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Toggle Type */}
                      {config.type === "toggle" && (
                         <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-white/5">
                            <span className="text-[13px] font-medium text-slate-600 dark:text-white/70">Enable {config.label}</span>
                            <Switch 
                              value={filterValues[config.key]} 
                              onChange={(val) => handleValueChange(config.key, val)}
                              size="sm"
                            />
                         </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer - Normal Buttons */}
              <div className="px-6 py-4 border-t border-slate-50 dark:border-white/5 flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-[#0c1221]">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full sm:w-auto !rounded-lg border-slate-200 dark:border-white/10 text-slate-500 transition-colors"
                  label={
                    <div className="flex items-center gap-1.5 px-1">
                       <RotateCcw size={14} />
                       <span className="text-xs font-semibold tracking-wide">Reset</span>
                    </div>
                  }
                />
                
                <div className="flex-1" />

                <div className="flex w-full sm:w-auto gap-2">
                  <Button
                    onClick={onClose}
                    className="flex-1 sm:flex-none border border-transparent bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200"
                    label={<span className="text-xs font-semibold tracking-wide">Cancel</span>}
                  />
                  <Button
                    onClick={handleApply}
                    disabled={!isChanged}
                    className="flex-1 sm:flex-none !rounded-lg bg-primary2 text-white hover:bg-primary1 px-6 shadow-none"
                    label={
                      <div className="flex items-center gap-1.5">
                         <span className="text-xs font-semibold tracking-wide">Apply Filters</span>
                         <CheckCircle2 size={14} />
                      </div>
                    }
                  />
                </div>
              </div>

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FTTHAdvanceFilterModal;

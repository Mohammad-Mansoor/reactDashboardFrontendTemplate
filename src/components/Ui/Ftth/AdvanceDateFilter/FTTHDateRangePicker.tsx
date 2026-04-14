
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Calendar, ChevronDown, Check, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button";
import { InputElement } from "../inputs";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export type DateRange = {
  start: string;
  end: string;
};

interface FTTHDateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  placeholder?: string;
  className?: string;
}

const PRESETS = [
  { label: "Today", getValue: () => ({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] }) },
  { label: "Yesterday", getValue: () => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    const date = d.toISOString().split('T')[0];
    return { start: date, end: date };
  }},
  { label: "Last 7 Days", getValue: () => {
    const end = new Date().toISOString().split('T')[0];
    const d = new Date(); d.setDate(d.getDate() - 7);
    const start = d.toISOString().split('T')[0];
    return { start, end };
  }},
  { label: "Last 30 Days", getValue: () => {
    const end = new Date().toISOString().split('T')[0];
    const d = new Date(); d.setDate(d.getDate() - 30);
    const start = d.toISOString().split('T')[0];
    return { start, end };
  }},
  { label: "This Month", getValue: () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const end = new Date().toISOString().split('T')[0];
    return { start, end };
  }},
  { label: "All Time", getValue: () => ({ start: "", end: "" }) },
];

/* ─── Main Component ─────────────────────────────────────────────────────── */

const FTTHDateRangePicker: React.FC<FTTHDateRangePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date range",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tempRange, setTempRange] = useState<DateRange>(value);

  // Sync temp range when value changes externally
  useEffect(() => {
    setTempRange(value);
  }, [value]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    const newVal = preset.getValue();
    onChange(newVal);
    setIsOpen(false);
  };

  const handleApply = () => {
    onChange(tempRange);
    setIsOpen(false);
  };

  const displayText = useMemo(() => {
    if (!value.start && !value.end) return placeholder;
    if (value.start === value.end && value.start) return value.start;
    return `${value.start || "..."} - ${value.end || "..."}`;
  }, [value, placeholder]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-4 h-10 rounded-xl border transition-all duration-300
          ${isOpen ? 'border-primary1 ring-4 ring-primary1/10 bg-white dark:bg-white/5' : 'border-slate-200 dark:border-white/10 hover:border-primary1 bg-transparent'}
          group
        `}
      >
        <Calendar size={18} className={`${isOpen ? 'text-primary1' : 'text-slate-400 group-hover:text-primary1'} transition-colors`} />
        <span className={`text-sm font-bold uppercase tracking-widest ${!value.start && !value.end ? 'text-slate-400' : 'text-slate-700 dark:text-white/80'}`}>
          {displayText}
        </span>
        <ChevronDown size={16} className={`text-slate-400 group-hover:text-primary1 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary1' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 mt-3 z-[1000] w-[420px] bg-white dark:bg-[#0c1221] border border-slate-100 dark:border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] backdrop-blur-xl overflow-hidden flex"
          >
            {/* Sidebar Presets */}
            <div className="w-[140px] border-r border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 p-2.5 flex flex-col gap-1">
               <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] px-2 mb-2">Presets</span>
               {PRESETS.map((preset) => {
                 const currentVal = preset.getValue();
                 const isActive = value.start === currentVal.start && value.end === currentVal.end;
                 
                 return (
                   <button
                     key={preset.label}
                     onClick={() => handlePresetClick(preset)}
                     className={`
                       flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all
                       ${isActive ? 'bg-primary1 text-white shadow-lg shadow-primary1/20' : 'text-slate-500 dark:text-white/40 hover:bg-white dark:hover:bg-white/5 hover:text-primary1'}
                     `}
                   >
                     {preset.label}
                     {isActive && <Check size={12} />}
                   </button>
                 );
               })}
            </div>

            {/* Custom Range Content */}
            <div className="flex-1 p-5 flex flex-col gap-5">
               <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[12px] font-black text-slate-700 dark:text-white uppercase tracking-widest">Custom Range</h4>
                  <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                    <X size={16} />
                  </button>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">From Date</label>
                    <InputElement
                      type="date"
                      value={tempRange.start}
                      onChange={(e) => setTempRange(prev => ({ ...prev, start: e.target.value }))}
                      className="!h-9 !bg-slate-50/50 dark:!bg-white/5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">To Date</label>
                    <InputElement
                      type="date"
                      value={tempRange.end}
                      onChange={(e) => setTempRange(prev => ({ ...prev, end: e.target.value }))}
                      className="!h-9 !bg-slate-50/50 dark:!bg-white/5"
                    />
                  </div>
               </div>

               <div className="mt-2 flex items-center justify-end gap-3 pt-4 border-t border-slate-50 dark:border-white/5">
                  <Button
                    bg="transparent"
                    height="h-8"
                    className="!h-8 text-[11px] font-bold uppercase tracking-widest text-slate-400 border-none shadow-none"
                    onClick={() => setTempRange({ start: "", end: "" })}
                    label="Clear"
                  />
                  <Button
                    height="h-8"
                    className="!h-8 !rounded-lg bg-primary1 text-white px-5 shadow-lg shadow-primary1/20"
                    onClick={handleApply}
                    label={
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest">Apply</span>
                        <ArrowRight size={14} />
                      </div>
                    }
                  />
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FTTHDateRangePicker;

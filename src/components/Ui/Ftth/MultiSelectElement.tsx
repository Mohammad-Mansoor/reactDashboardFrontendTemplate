import { useState, useRef, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa";
import Lottie from "lottie-react";
import Spinner from "./spinner";
import emptyAnimation from "../../lottieFiles/PurpleQuestions.json";

/**
 * MultiSelect Component
 */
interface MultiSelectProps {
  items?: any[];
  valueKey?: string;
  getLabel?: (item: any) => string;
  placeholder?: string;
  initialSelected?: any[];
  onChange?: (item: any[]) => void;
  className?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean | string;
  hint?: React.ReactNode;
  label?: string;
  required?: boolean;

  // Async Support
  isAsync?: boolean;
  asyncFetch?: (query: string) => void | Promise<void>;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadMoreLabel?: string;
}

export default function MultiSelect({
  items = [],
  valueKey = "value",
  getLabel = (item) => item.label || "",
  placeholder = "Select...",
  initialSelected = [],
  onChange = () => {},
  className = "",
  disabled = false,
  success = false,
  error = false,
  hint,
  label,
  required = false,
  isAsync = false,
  asyncFetch,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  loadMoreLabel = "Load More",
}: MultiSelectProps) {
  const [selectedItems, setSelectedItems] = useState<any[]>(initialSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // 🔹 Synchronization logic guard
  const prevInitialSelectedRef = useRef(JSON.stringify(initialSelected));

  useEffect(() => {
    const currentPropStr = JSON.stringify(initialSelected);
    if (currentPropStr !== prevInitialSelectedRef.current) {
      prevInitialSelectedRef.current = currentPropStr;
      
      const resolveIncoming = (incomingArr: any[]) => {
        if (!Array.isArray(incomingArr)) return [];
        return incomingArr.map((val) => {
          if (val !== null && typeof val === "object") return val;
          return items.find((item) => String(item[valueKey]) === String(val)) || { [valueKey]: val, label: String(val) };
        });
      };

      const newResolved = resolveIncoming(initialSelected);
      if (JSON.stringify(newResolved) !== JSON.stringify(selectedItems)) {
        setSelectedItems(newResolved);
      }
    }
  }, [initialSelected, valueKey]);

  // Sync labels for primitive IDs
  useEffect(() => {
    if (items.length > 0 && selectedItems.length > 0) {
      const updated = selectedItems.map(s => {
        if (typeof s === "object" && s.label) return s;
        const id = typeof s === "object" ? s[valueKey] : s;
        const found = items.find(i => String(i[valueKey]) === String(id));
        return found || s;
      });
      if (JSON.stringify(updated) !== JSON.stringify(selectedItems)) {
        setSelectedItems(updated);
      }
    }
  }, [items]);

  // Filter logic with Context Persistence
  const filteredItems = (() => {
    // Determine base and search string
    let base = [...items];
    const search = isAsync ? "" : inputValue.toLowerCase();
    
    // Filter out items already selected EXCEPT in async mode where we might want to see them to untoggle
    // Actually, for better UX in MultiSelect, we leave them in the list with a "Selected" marker or just hide them
    // Let's hide them for cleaner search results, but they exist in the area above.
    let result = base.filter(item => 
      !selectedItems.some(s => String(s[valueKey]) === String(item[valueKey])) &&
      getLabel(item).toLowerCase().includes(search)
    );
    
    return result;
  })();

  const asyncFetchRef = useRef(asyncFetch);
  useEffect(() => { asyncFetchRef.current = asyncFetch; }, [asyncFetch]);

  useEffect(() => {
    if (!isAsync || !isOpen) return;
    const intervalId = setTimeout(() => {
      if (asyncFetchRef.current) asyncFetchRef.current(inputValue);
    }, 300);
    return () => clearTimeout(intervalId);
  }, [inputValue, isAsync, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && e.target instanceof Node && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelectItem = (item: any) => {
    const isAlreadySelected = selectedItems.some(s => String(s[valueKey]) === String(item[valueKey]));
    const newSelected = isAlreadySelected 
      ? selectedItems.filter(s => String(s[valueKey]) !== String(item[valueKey]))
      : [...selectedItems, item];
    
    setSelectedItems(newSelected);
    onChange(newSelected);
    if (!isAsync) setInputValue("");
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const removeItem = (item: any) => {
    const newSelected = selectedItems.filter(s => String(s[valueKey]) !== String(item[valueKey]));
    setSelectedItems(newSelected);
    onChange(newSelected);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex(p => (p + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(p => (p - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[highlightedIndex]) toggleSelectItem(filteredItems[highlightedIndex]);
    }
  };

  let stateClasses = "border-primary5 dark:border-gray-700/80";
  if (error) stateClasses = "border-red-500 text-red-900";
  else if (success) stateClasses = "border-emerald-500 text-emerald-900";
  if (disabled) stateClasses = "bg-slate-50 opacity-70 cursor-not-allowed";

  return (
    <div className={`relative flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-[13px] font-medium text-gray-700 dark:text-gray-300 ml-0.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative w-full" ref={containerRef}>
        <div
          className={`relative pr-10 flex items-center flex-wrap gap-1 min-h-[40px] px-3 py-1.5 text-[14px] font-medium border rounded-sm transition-all duration-300 ${stateClasses} ${isOpen ? "ring-4 ring-primary2/20 border-primary2" : ""}`}
          onClick={() => !disabled && setIsOpen(true)}
        >
          {selectedItems.map((item) => (
            <span key={item[valueKey]} className="flex items-center text-[13px] bg-primary5/60 dark:bg-primary2/20 px-2 py-0.5 rounded-sm">
              {item.icon && <span className="mr-1.5">{item.icon}</span>}
              {item.image && <img src={item.image} className="w-4 h-4 rounded-full mr-1.5" />}
              {getLabel(item)}
              <button disabled={disabled} onClick={(e) => { e.stopPropagation(); removeItem(item); }} className="ms-2 text-gray-400 hover:text-red-500">&times;</button>
            </span>
          ))}
          <input
            className="flex-1 outline-none bg-transparent"
            placeholder={selectedItems.length === 0 ? placeholder : ""}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={disabled}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          <FaAngleDown />
        </div>

        <div className={`absolute z-20 left-0 right-0 top-[calc(100%+6px)] transition-all duration-300 origin-top ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-95 pointer-events-none"}`}>
          <ul className="w-full py-1.5 border border-primary5 dark:border-gray-700 bg-white dark:bg-slate-900 rounded-sm shadow-xl max-h-60 overflow-auto">
            {filteredItems.length > 0 && !isLoading ? (
              filteredItems.map((item, index) => (
                <li
                  key={item[valueKey]}
                  className={`flex items-center text-[13.5px] px-4 py-2.5 cursor-pointer ${index === highlightedIndex ? "bg-gray-50 dark:bg-slate-800 text-primary2" : "text-gray-700 dark:text-gray-200"}`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => toggleSelectItem(item)}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.image && <img src={item.image} className="w-5 h-5 rounded-full mr-2" />}
                  <span className="truncate">{getLabel(item)}</span>
                </li>
              ))
            ) : isLoading ? (
              <div className="w-full py-8 flex items-center justify-center"><Spinner size="sm" /></div>
            ) : (
              <div className="w-full py-8 flex flex-col items-center"><Lottie animationData={emptyAnimation} className="w-12 h-12" /><p className="text-[13px] text-gray-500 mt-2">No more items available</p></div>
            )}

            {hasMore && !isLoading && (
              <li className="px-2 py-1 sticky bottom-0 bg-white dark:bg-slate-900 border-t dark:border-gray-800">
                <button onClick={(e) => { e.stopPropagation(); onLoadMore?.(); }} className="w-full py-2 bg-gray-50 dark:bg-slate-800 hover:bg-primary2/10 text-primary2 font-bold text-[11px] uppercase tracking-widest rounded-sm transition-all">
                  {loadMoreLabel}
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
      {(hint || typeof error === "string") && (
        <p className={`text-[12.5px] ml-0.5 ${error ? "text-red-500" : success ? "text-emerald-500" : "text-gray-400"}`}>
          {typeof error === "string" ? error : hint}
        </p>
      )}
    </div>
  );
}

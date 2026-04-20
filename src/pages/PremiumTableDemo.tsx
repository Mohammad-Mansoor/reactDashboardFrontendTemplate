
import { useState, useMemo } from "react";
import PageMeta from "../components/Common/PageMeta";
import FTTHPremiumDataTable, { FTTHColumn } from "../components/Ui/Ftth/Table/FTTHPremiumDataTable";
import TableBadge from "../components/Ui/Ftth/Table/TableBadge";
import Avatar from "../components/Ui/Ftth/Avatar";
import FTTHAdvancedFilterModal, { FilterConfig } from "../components/Ui/Ftth/AdvanceDateFilter/FTTHAdvanceDateFilter";
import { DateRangePicker } from "../components/Ui/Ftth/DateFilter/date-range-picker";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Ui/Ftth/Button";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: string;
  status: "active" | "pending" | "suspended";
  category: string;
  date: string;
}

const MOCK_ORDERS: Order[] = [
  { id: "ORD-7721", customer: { name: "Sarah Connor", email: "s.connor@sky.net", avatar: "https://i.pravatar.cc/150?u=sarah" }, amount: "$1,240.00", status: "active", category: "Hardware", date: "Apr 12, 2024" },
  { id: "ORD-9902", customer: { name: "Rick Sanchez", email: "rick.c137@citadel.com", avatar: "https://i.pravatar.cc/150?u=rick" }, amount: "$450.00", status: "pending", category: "Software", date: "Apr 11, 2024" },
  { id: "ORD-1120", customer: { name: "Morty Smith", email: "morty.s@citadel.com", avatar: "https://i.pravatar.cc/150?u=morty" }, amount: "$89.99", status: "active", category: "Subscription", date: "Apr 10, 2024" },
  { id: "ORD-4432", customer: { name: "Walter White", email: "heisenberg@pollos.com", avatar: "https://i.pravatar.cc/150?u=walter" }, amount: "$15,000.00", status: "suspended", category: "Chemicals", date: "Apr 09, 2024" },
  { id: "ORD-5561", customer: { name: "Jesse Pinkman", email: "capn.cook@bitch.com", avatar: "https://i.pravatar.cc/150?u=jesse" }, amount: "$1,200.00", status: "active", category: "Lab Gear", date: "Apr 08, 2024" },
  { id: "ORD-6672", customer: { name: "Gustavo Fring", email: "gus@pollos.com", avatar: "https://i.pravatar.cc/150?u=gus" }, amount: "$45,000.00", status: "active", category: "Logistics", date: "Apr 07, 2024" },
  { id: "ORD-1111", customer: { name: "Lyman Zerga", email: "lyman@casino.com", avatar: "https://i.pravatar.cc/150?u=lyman" }, amount: "$50,000.00", status: "active", category: "Consulting", date: "Apr 06, 2024" },
  { id: "ORD-2222", customer: { name: "Danny Ocean", email: "danny@ocean.com", avatar: "https://i.pravatar.cc/150?u=danny" }, amount: "$11.00", status: "pending", category: "Logistics", date: "Apr 05, 2024" },
  { id: "ORD-3333", customer: { name: "Rusty Ryan", email: "rusty@ocean.com", avatar: "https://i.pravatar.cc/150?u=rusty" }, amount: "$800.00", status: "active", category: "Hardware", date: "Apr 04, 2024" },
  { id: "ORD-4444", customer: { name: "Linus Caldwell", email: "linus@ocean.com", avatar: "https://i.pravatar.cc/150?u=linus" }, amount: "$150.00", status: "active", category: "Software", date: "Apr 03, 2024" },
  { id: "ORD-5555", customer: { name: "Terry Benedict", email: "terry@bellagio.com", avatar: "https://i.pravatar.cc/150?u=terry" }, amount: "$150,000.00", status: "suspended", category: "Entertainment", date: "Apr 02, 2024" },
  { id: "ORD-6666", customer: { name: "Basher Tarr", email: "basher@ocean.com", avatar: "https://i.pravatar.cc/150?u=basher" }, amount: "$2,400.00", status: "active", category: "Electronics", date: "Apr 01, 2024" },
];

/* ─── Page Component ─────────────────────────────────────────────────────── */

export default function PremiumTableDemo() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const initialVisibleColumns = ["customer", "amount", "category", "date", "status"];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(initialVisibleColumns);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const filterConfigs: FilterConfig[] = [
    { key: "status", label: "Status", type: "dropdown", options: [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "suspended", label: "Suspended" }
    ] },
    { key: "category", label: "Category", type: "dropdown", options: [
      { value: "Hardware", label: "Hardware" },
      { value: "Software", label: "Software" },
      { value: "Subscription", label: "Subscription" },
      { value: "Logistics", label: "Logistics" }
    ] },
    { key: "dateRange", label: "Created Date", type: "date-range" }
  ];

  const columns: FTTHColumn<Order>[] = useMemo(() => [
    {
      key: "id",
      header: "Order ID",
      sortable: true,
      render: (val) => <span className="text-primary1 font-black underline underline-offset-4 decoration-primary1/20 cursor-pointer">{val}</span>
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-3">
          <Avatar src={val.avatar} size="sm" fallback={val.name.charAt(0)} />
          <div className="flex flex-col">
            <span className="font-black text-slate-900 dark:text-white">{val.name}</span>
            <span className="text-[11px] font-medium text-slate-400 dark:text-white/20">{val.email}</span>
          </div>
        </div>
      )
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
    },
    {
      key: "category",
      header: "Category",
      render: (val) => (
         <span className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-[11px] font-bold text-slate-500 dark:text-white/30 tracking-tight">
            {val}
         </span>
      )
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      render: (val) => {
        const variantMap = {
          active: "success",
          pending: "warning",
          suspended: "error"
        } as const;
        return <TableBadge label={val} variant={variantMap[val]} />;
      }
    }
  ], []);
  const checkHasValue = (value: any) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "number") return true;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") {
      return Object.values(value).some((v) => v !== null && v !== "" && v !== undefined);
    }
    return !!value;
  };

  const hasAnyActiveFilter = useMemo(() => {
    return Object.values(activeFilters).some(checkHasValue);
  }, [activeFilters]);

  console.log("active filters ❤️❤️❤️", activeFilters);

  // Logic to filter and slice data for demo purposes (mimicking backend)
  const filteredData = useMemo(() => {
    return MOCK_ORDERS.filter(order => {
      // 1. Search Query
      const q = searchQuery.toLowerCase();
      const matchesSearch = q === "" || 
                           order.customer.name.toLowerCase().includes(q) ||
                           order.id.toLowerCase().includes(q);
      
      // 2. Status & Category Filter (Handling both string and object values)
      const getVal = (v: any) => (typeof v === 'object' && v !== null ? v.value : v);
      
      const activeStatus = getVal(activeFilters.status);
      const matchesStatus = !activeStatus || order.status === activeStatus;
      
      const activeCategory = getVal(activeFilters.category);
      const matchesCategory = !activeCategory || order.category === activeCategory;

      // 3. Date Range Filter (Robust day-boundary aware comparison)
      let matchesDate = true;
      if (activeFilters.dateRange && (activeFilters.dateRange.start || activeFilters.dateRange.end)) {
        const { start, end } = activeFilters.dateRange;
        const orderDate = new Date(order.date);
        orderDate.setHours(0,0,0,0);
        
        if (start) {
          const startDate = new Date(start);
          startDate.setHours(0,0,0,0);
          if (orderDate < startDate) matchesDate = false;
        }
        if (end && matchesDate) {
          const endDate = new Date(end);
          endDate.setHours(23,59,59,999);
          if (orderDate > endDate) matchesDate = false;
        }
      }
      
      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [searchQuery, activeFilters]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredData.slice(start, start + limit);
  }, [filteredData, page, limit]);

  return (
    <div className="p-6 md:p-12 min-h-screen bg-slate-50 dark:bg-[#070b14] transition-colors duration-500">
      <PageMeta 
        title="Premium DataTable Demo | FTTH UI" 
        description="A demonstration of the high-fidelity enterprise data table component."
      />

      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
            <div>
               <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3 uppercase">
                  <span className="w-1.5 h-8 bg-primary1 rounded-full" />
                  SaaS Dashboard
               </h1>
               <p className="text-slate-400 dark:text-white/20 font-bold uppercase tracking-widest text-[11px] mt-2 ml-4">Premium Components Library v2.0</p>
            </div>
            
            <button 
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 1500);
              }}
              className="px-6 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 hover:text-primary1 transition-all shadow-sm"
            >
              Simulate Loading
            </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-white/2 p-4 rounded-xl border border-slate-100 dark:border-white/5 mb-6">
            <div className="w-full sm:w-auto flex items-center gap-2">
               <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
            <div className="hidden sm:block h-6 w-px bg-slate-100 dark:bg-white/10" />
            <Button 
                bg="bg-primary2"
                className="w-full sm:w-auto !h-11 sm:!h-10 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 shadow-none !rounded-md"
                icon={<SlidersHorizontal size={18} />}
                label={<span className="text-[11px] font-black uppercase tracking-widest px-2">Advanced Filters</span>}
                onClick={() => setIsFilterOpen(true)}
            />
        </div>

        {/* 🔵 ACTIVE FILTER CHIPS (The Magic) */}
        <AnimatePresence>
          {hasAnyActiveFilter && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 flex flex-wrap gap-2 items-center px-4 py-3 bg-slate-100/30 dark:bg-white/1 rounded-xl border border-dashed border-slate-200 dark:border-white/10"
            >
              <span className="text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mr-2">Active Filters:</span>
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!checkHasValue(value)) return null;
                
                let chipLabel = "";
                // Mapping labels based on the specific keys in our Table Demo
                if (key === "status") {
                   const statusVal = typeof value === 'object' ? value.label || value.value : value;
                   chipLabel = `Status: ${statusVal}`;
                } else if (key === "category") {
                   const catVal = typeof value === 'object' ? value.label || value.value : value;
                   chipLabel = `Category: ${catVal}`;
                } else if (key === "dateRange") {
                   chipLabel = `Period: ${value.start || '...'} to ${value.end || '...'}`;
                } else {
                   chipLabel = `${key}: ${typeof value === 'object' ? value.label || value.value || 'Active' : value}`;
                }

                return (
                  <motion.div 
                    key={key} 
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-primary1/10 border-2 border-primary1/40 dark:border-primary1/30 rounded-full group transition-all hover:bg-primary1/5 shadow-sm"
                  >
                    <span className="text-[10px] font-black uppercase text-primary1 tracking-widest">{chipLabel}</span>
                    <button 
                        onClick={() => {
                          const newFilters = { ...activeFilters };
                          delete newFilters[key];
                          setActiveFilters(newFilters);
                        }}
                        className="w-4 h-4 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    >
                        <X size={10} strokeWidth={4} />
                    </button>
                  </motion.div>
                );
              })}
              
              <button 
                 onClick={() => setActiveFilters({})}
                 className="ml-4 h-8 px-4 text-[11px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full uppercase tracking-widest transition-all cursor-pointer"
               >
                 Clear All
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <FTTHPremiumDataTable 
          title="Recent Orders"
          subtitle="Manage your transactions and export reports"
          columns={columns}
          visibleColumnKeys={visibleColumns}
          onVisibleColumnsChange={setVisibleColumns}
          data={paginatedData}
          loading={loading}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          onExport={(format) => alert(`Generating ${format.toUpperCase()} report...`)}
          onViewClick={(row) => alert(`Viewing ${row.id}`)}
          onEditClick={(row) => alert(`Editing ${row.id}`)}
          onDeleteClick={(row) => alert(`Deleting ${row.id}`)}
          primaryActionLabel="Create Invoice"
          meta={{
            total: filteredData.length,
            page: page,
            limit: limit,
            totalPages: Math.ceil(filteredData.length / limit)
          }}
          onPageChange={setPage}
          onLimitChange={(l) => {
             setLimit(l);
             setPage(1);
          }}
        />

        <FTTHAdvancedFilterModal 
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filterConfig={filterConfigs}
          initialValues={activeFilters}
          onApply={(vals) => {
            console.log("PARENT onApply received:", vals);
            setActiveFilters(vals);
            setPage(1);
            setIsFilterOpen(false);
          }}
        />

        <div className="mt-12 p-8 rounded-[32px] bg-primary1/5 border border-primary1/10 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white/80">Ready for Production</h3>
            <p className="text-sm text-slate-400 dark:text-white/20 mt-2 max-w-md">This component is built on an 8px grid system, fully responsive, and supports both RTL and Dark Mode natively.</p>
        </div>
      </div>
    </div>
  );
}

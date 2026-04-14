
import { useState, useMemo } from "react";
import { 
  Users, 
  SlidersHorizontal, 
  MoreVertical, 
  Stethoscope,
  Activity,
  AlertCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageMeta from "../components/Common/PageMeta";

// Ftth Components
import Button from "../components/Ui/Ftth/Button";
import Avatar from "../components/Ui/Ftth/Avatar";
import { SearchInputElement } from "../components/Ui/Ftth/inputs";
import FTTHAdvancedFilterModal, { FilterConfig } from "../components/Ui/Ftth/AdvanceDateFilter/FTTHAdvanceDateFilter";
import { DateRangePicker } from "../components/Ui/Ftth/DateFilter/date-range-picker";
import { getLocalTimeZone } from "@internationalized/date";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

const DEPARTMENTS = [
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "oncology", label: "Oncology" },
  { value: "emergency", label: "Emergency" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "discharged", label: "Discharged" },
  { value: "pending", label: "Pending" },
];

const MOCK_PATIENTS = [
  { id: "P-1001", name: "Alice Johnson", age: 45, gender: "female", department: "cardiology", status: "active", date: "2024-03-10", image: "https://i.pravatar.cc/150?u=alice", isVip: true },
  { id: "P-1002", name: "Bob Wilson", age: 62, gender: "male", department: "neurology", status: "discharged", date: "2024-03-08", image: "https://i.pravatar.cc/150?u=bob", isVip: false },
  { id: "P-1003", name: "Charlie Davis", age: 28, gender: "male", department: "pediatrics", status: "active", date: "2024-03-12", image: "https://i.pravatar.cc/150?u=charlie", isVip: true },
  { id: "P-1004", name: "Diana Prince", age: 34, gender: "female", department: "oncology", status: "pending", date: "2024-03-11", image: "https://i.pravatar.cc/150?u=diana", isVip: false },
  { id: "P-1005", name: "Edward Norton", age: 52, gender: "male", department: "emergency", status: "active", date: "2024-03-09", image: "https://i.pravatar.cc/150?u=edward", isVip: false },
  { id: "P-1006", name: "Fiona Gallagher", age: 31, gender: "female", department: "cardiology", status: "active", date: "2024-03-07", image: "https://i.pravatar.cc/150?u=fiona", isVip: true },
];

/* ─── Filter Configuration ─────────────────────────────────────────────── */

const FILTER_CONFIG: FilterConfig[] = [
  {
    key: "status",
    label: "Patient Status",
    type: "dropdown",
    options: STATUS_OPTIONS,
    placeholder: "Select Status"
  },
  {
    key: "departments",
    label: "Departments",
    type: "dropdown",
    multiSelect: true,
    options: DEPARTMENTS,
    placeholder: "Select Departments"
  },
  {
    key: "ageRange",
    label: "Age Range",
    type: "range",
    min: 0,
    max: 100,
    unit: "Years"
  },
  {
    key: "gender",
    label: "Gender",
    type: "checkbox",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" }
    ]
  },
  {
    key: "admissionDate",
    label: "Admission Date",
    type: "date"
  },
  {
    key: "admissionRange",
    label: "Admission Period",
    type: "date-range",
    info: "Select a custom range for admission"
  },
  {
    key: "isVip",
    label: "VIP Patient",
    type: "toggle",
    info: "Toggle to show only VIP patients"
  }
];

/* ─── Page Component ─────────────────────────────────────────────────────── */

export default function FilterTestPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [externalDateRange, setExternalDateRange] = useState<any>(null);

  const filteredPatients = useMemo(() => {
    return MOCK_PATIENTS.filter(patient => {
      // Search
      if (searchQuery && !patient.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Status
      if (filters.status && patient.status !== filters.status.value) return false;

      // Departments (Multi)
      if (filters.departments && filters.departments.length > 0) {
        const depValues = filters.departments.map((d: any) => d.value);
        if (!depValues.includes(patient.department)) return false;
      }

      // Age Range
      if (filters.ageRange) {
        if (patient.age < filters.ageRange.min || patient.age > filters.ageRange.max) return false;
      }

      // Gender (Checkbox)
      if (filters.gender && filters.gender.length > 0) {
        if (!filters.gender.includes(patient.gender)) return false;
      }

      // Date
      if (filters.admissionDate && patient.date !== filters.admissionDate) return false;

      // Date Range
      if (filters.admissionRange) {
        if (filters.admissionRange.start && patient.date < filters.admissionRange.start) return false;
        if (filters.admissionRange.end && patient.date > filters.admissionRange.end) return false;
      }

      // VIP (Toggle)
      if (filters.isVip && !patient.isVip) return false;

      // External Date Range Logic (Handle @internationalized/date)
      if (externalDateRange) {
        const startStr = externalDateRange.start.toDate(getLocalTimeZone()).toISOString().split('T')[0];
        const endStr = externalDateRange.end.toDate(getLocalTimeZone()).toISOString().split('T')[0];
        if (patient.date < startStr || patient.date > endStr) return false;
      }

      return true;
    });
  }, [filters, searchQuery, externalDateRange]);

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-slate-50 dark:bg-[#070b14] transition-colors duration-500">
      <PageMeta 
        title="Advanced Filter Test | HCMS" 
        description="A page to test the newly redesigned advanced filter modal with a table view."
      />

      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Patient Directory</h1>
          </div>
          <p className="text-slate-500 dark:text-white/40 text-sm font-medium">Manage and monitor patient records with advanced filtering.</p>
        </div>

        <div className="flex items-center gap-3">
           <SearchInputElement 
             placeholder="Search by name..." 
             containerClassName="w-full md:w-64"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
           
           <DateRangePicker 
             value={externalDateRange}
             onChange={setExternalDateRange}
           />
           <Button 
             onClick={() => setIsFilterOpen(true)}
             className="!rounded-sm border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-white dark:hover:bg-white/5 bg-transparent"
             label={
               <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} />
                  <span className="text-sm font-bold uppercase tracking-widest px-1">Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                       {Object.keys(filters).length}
                    </span>
                  )}
               </div>
             }
           />
        </div>
      </div>

      {/* Active Filter Chips */}
      <AnimatePresence>
        {Object.keys(filters).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8 flex flex-wrap gap-2 items-center"
          >
            <span className="text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em] mr-2">Active Filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              let label = "";
              if (key === "status") label = `Status: ${value.label}`;
              else if (key === "departments") label = `Dep: ${value.length} selected`;
              else if (key === "ageRange") label = `Age: ${value.min}-${value.max}`;
              else if (key === "gender") label = `Gender: ${value.join(", ")}`;
              else if (key === "admissionDate") label = `On: ${value}`;
              else if (key === "admissionRange") label = `Period: ${value.start || '...'} to ${value.end || '...'}`;

              return (
                <motion.div 
                  key={key} 
                  layout
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 text-blue-700 dark:text-blue-400"
                >
                  <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
                  <button onClick={() => removeFilter(key)} className="hover:text-red-500 transition-colors cursor-pointer">
                    <X size={12} />
                  </button>
                </motion.div>
              );
            })}
            {externalDateRange && (
              <motion.div 
                layout
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary1/10 border border-primary1/20 text-primary1"
              >
                <span className="text-[11px] font-black uppercase tracking-widest">
                   Custom Range Active
                </span>
                <button onClick={() => setExternalDateRange(null)} className="hover:text-red-500 transition-colors cursor-pointer">
                  <X size={12} />
                </button>
              </motion.div>
            )}

            <button 
              onClick={() => {
                setFilters({});
                setExternalDateRange(null);
              }}
              className="text-[11px] font-black text-red-500 uppercase tracking-widest hover:underline px-2 cursor-pointer"
            >
              Clear All
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table Section */}
      <div className="bg-white/80 dark:bg-[#0c1221]/80 backdrop-blur-xl border border-white dark:border-white/10 rounded-[32px] shadow-xl overflow-hidden overflow-x-auto transition-colors">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5">
              <th className="px-8 py-6 text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.25em]">Patient</th>
              <th className="px-6 py-6 text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.25em]">Details</th>
              <th className="px-6 py-6 text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.25em]">Department</th>
              <th className="px-6 py-6 text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.25em]">Admission</th>
              <th className="px-6 py-6 text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.25em]">Status</th>
              <th className="px-6 py-6 text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.25em] text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, idx) => (
                <motion.tr 
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <Avatar src={patient.image} size="md" fallback={patient.name.substring(0,2).toUpperCase()} />
                      <div>
                        <div className="text-[14px] font-black text-slate-900 dark:text-white">{patient.name}</div>
                        <div className="text-[12px] font-bold text-slate-400 dark:text-white/30">{patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-bold text-slate-600 dark:text-white/70">{patient.age} Yrs</div>
                    <div className="text-[11px] font-black text-slate-400 dark:text-white/20 uppercase tracking-widest">{patient.gender}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                        {patient.department === 'cardiology' ? <Activity size={14} /> : <Stethoscope size={14} />}
                      </div>
                      <span className="text-[13px] font-bold text-slate-800 dark:text-white/90 capitalize">{patient.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[13px] font-bold text-slate-600 dark:text-white/60">
                    {new Date(patient.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                      ${patient.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 
                        patient.status === 'discharged' ? 'bg-slate-500/10 text-slate-600 dark:text-slate-400' : 
                        'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${patient.status === 'active' ? 'bg-emerald-500' : patient.status === 'discharged' ? 'bg-slate-500' : 'bg-orange-500'}`} />
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                    <AlertCircle size={40} className="text-slate-200 dark:text-white/5 mb-4" />
                    <p className="text-slate-500 dark:text-white/30 font-bold uppercase tracking-widest">No patients match your filters</p>
                    <button onClick={() => setFilters({})} className="mt-4 text-blue-600 font-black uppercase tracking-widest hover:underline italic cursor-pointer">Clear all filters</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* The Advanced Filter Modal */}
      <FTTHAdvancedFilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterConfig={FILTER_CONFIG}
        initialValues={filters}
        onApply={(values) => setFilters(values)}
        title="Advanced Patient Filter"
      />
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { 
  X, 
  Menu,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  Settings,
  User,
  Headset,
  LogOut,
  ArrowLeft,
  ChevronLeft,
  ShieldCheck,
  History
} from "lucide-react";

import { useSidebar } from "../context/SidebarContext";
import { usePermissions } from "../context/PermissionsContext";
import { MENU_CONFIG } from "../constants/menuConfig";
import { filterMenuItems, getActiveParentIds } from "../utils/sidebarUtils";
import SidebarGroup from "./Sidebar/SidebarGroup";
import { AppDispatch } from "../store/store";
import { logoutUser, logoutAll, logoutOther } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const AppSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  
  const { 
    isExpanded, 
    isMobileOpen, 
    isHovered, 
    setIsHovered, 
    toggleMobileSidebar,
    setOpenItemIds,
    openItemIds
  } = useSidebar();
  
  const { permissions } = usePermissions();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 1. Filter items based on RBAC
  const filteredNavItems = useMemo(() => {
    return filterMenuItems(MENU_CONFIG, permissions);
  }, [permissions]);

  // 2. Auto-expand parents on route change
  useEffect(() => {
    const parentIds = getActiveParentIds(filteredNavItems, location.pathname);
    if (parentIds.length > 0) {
      setOpenItemIds(Array.from(new Set([...openItemIds, ...parentIds])));
    }
  }, [location.pathname, filteredNavItems]);

  const isActuallyExpanded = isExpanded || isHovered || isMobileOpen;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/signin");
  };

  const menuVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 }
  };

  const userMenuVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
  };

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileSidebar}
            className="fixed inset-0 z-[887] bg-slate-900/60 backdrop-blur-sm lg:hidden transition-all duration-500"
          />
        )}
      </AnimatePresence>

      <aside
        id="app-sidebar"
        className={`app-sidebar fixed flex flex-col top-0 start-0 h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-[888] overflow-x-hidden
          bg-white dark:bg-[#070b14] border-e border-slate-200 dark:border-white/5 shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)]
          ${isActuallyExpanded ? "w-[240px]" : "w-[72px]"}
          ${isMobileOpen ? "translate-x-0" : "max-lg:ltr:-translate-x-full max-lg:rtl:translate-x-full lg:translate-x-0"}`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-dashed border-slate-100 dark:border-white/5 mb-4 shrink-0 overflow-hidden">
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-primary1 to-primary2 flex items-center justify-center shadow-lg shadow-primary1/20 transition-transform duration-500 group-hover:rotate-12 shrink-0`}>
               <LayoutGrid className="text-white" size={20} />
            </div>
            {isActuallyExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase leading-tight">Qalam</span>
                <span className="text-[9px] font-bold text-primary1 uppercase tracking-[0.2em] leading-tight">Healthcare</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Dynamic Content Area: Nav OR User Menu */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2 relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            {!isUserMenuOpen ? (
              <motion.div
                key="nav"
                variants={menuVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <div className={`px-6 mb-4 flex items-center ${!isActuallyExpanded ? "justify-center" : "justify-between"}`}>
                  {isActuallyExpanded ? (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/20">Menu</span>
                  ) : (
                    <MoreHorizontal className="text-slate-300 dark:text-white/10" size={20} />
                  )}
                </div>
                <nav className="">
                  <SidebarGroup items={filteredNavItems} />
                </nav>
              </motion.div>
            ) : (
              <motion.div
                key="user-menu"
                variants={userMenuVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="w-full px-4"
              >
                {/* Back Button */}
                <button 
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-primary1 hover:bg-primary1/10 rounded-lg transition-colors mb-6 group"
                >
                  <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">Back to Menu</span>
                </button>

                <div className="space-y-1">
                  <span className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-white/20 block mb-3">Account</span>
                  
                  <UserMenuItem 
                    icon={<User size={18} />} 
                    label={t("common.edit_profile")} 
                    onClick={() => { navigate("/profile"); setIsUserMenuOpen(false); }} 
                    expanded={isActuallyExpanded}
                  />
                  <UserMenuItem 
                    icon={<Settings size={18} />} 
                    label={t("common.account_settings")} 
                    onClick={() => { navigate("/settings/account/security"); setIsUserMenuOpen(false); }} 
                    expanded={isActuallyExpanded}
                  />
                  <UserMenuItem 
                    icon={<Headset size={18} />} 
                    label={t("common.support")} 
                    onClick={() => setIsUserMenuOpen(false)} 
                    expanded={isActuallyExpanded}
                  />
                  
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5">
                    <UserMenuItem 
                      icon={<LogOut size={18} />} 
                      label={t("common.logout")} 
                      onClick={handleLogout} 
                      expanded={isActuallyExpanded}
                      variant="danger"
                    />
                    <UserMenuItem 
                      icon={<ShieldCheck size={18} />} 
                      label={t("common.logout_all")} 
                      onClick={async () => { await dispatch(logoutAll()); navigate("/signin"); }} 
                      expanded={isActuallyExpanded}
                      variant="danger"
                    />
                    <UserMenuItem 
                      icon={<History size={18} />} 
                      label={t("common.logout_other")} 
                      onClick={async () => { await dispatch(logoutOther()); toast.success("Other sessions logged out"); setIsUserMenuOpen(false); }} 
                      expanded={isActuallyExpanded}
                      variant="danger"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Footer - User Profile Preview */}
        <div className="p-4 mt-auto border-t border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 shrink-0">
            <div 
              onClick={() => setIsUserMenuOpen(true)}
              className={`flex items-center gap-3 cursor-pointer group/footer transition-all ${!isActuallyExpanded ? "justify-center" : "hover:bg-slate-100 dark:hover:bg-white/5 p-1 rounded-xl"}`}
            >
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-white/10 border-2 border-white dark:border-white/5 overflow-hidden shadow-sm transition-transform group-hover/footer:scale-105">
                      <img src="/images/user/owner.jpg" alt="User" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#070b14] rounded-full" />
                </div>
                
                {isActuallyExpanded && (
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white truncate">Musharof</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Administrator</span>
                  </div>
                )}
                
                {isActuallyExpanded && (
                  <div className="p-1.5 text-slate-400 group-hover/footer:text-primary1 transition-colors">
                     <Settings size={16} className={`${isUserMenuOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
                  </div>
                )}
            </div>
        </div>
      </aside>
    </>
  );
};

interface UserMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  expanded: boolean;
  variant?: "default" | "danger";
}

const UserMenuItem: React.FC<UserMenuItemProps> = ({ icon, label, onClick, expanded, variant = "default" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 group
      ${variant === "danger" 
        ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" 
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"}`}
  >
    <div className="shrink-0">{icon}</div>
    {expanded && <span className="text-sm font-bold truncate">{label}</span>}
  </button>
);

export default AppSidebar;

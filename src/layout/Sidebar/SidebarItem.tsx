import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MenuItem } from "../../constants/menuConfig";
import { useSidebar } from "../../context/SidebarContext";
import { isChildActive } from "../../utils/sidebarUtils";
import Tooltip from "../../components/Common/Tooltip";
import SidebarGroup from "./SidebarGroup";
import { useTranslation } from "react-i18next";

interface SidebarItemProps {
  item: MenuItem;
  depth?: number;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, depth = 0 }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isExpanded, isHovered, openItemIds, toggleOpenItem, isMobileOpen } = useSidebar();

  const hasChildren = item.children && item.children.length > 0;
  const isOpen = openItemIds.includes(item.id);
  const isActive = pathname === item.path || (hasChildren && isChildActive(item, pathname));
  const isLeafSelected = pathname === item.path;

  const isActuallyExpanded = isExpanded || isHovered || isMobileOpen;

  // Dynamic padding based on depth for full-width clickability
  const depthPadding = isActuallyExpanded ? (depth * 16 + 24) : 0;

  const content = (
    <div className="relative group/item">
      {hasChildren ? (
        <button
          onClick={() => toggleOpenItem(item.id)}
          style={{ paddingInlineStart: `${depthPadding}px` }}
          className={`flex items-center w-full py-3 transition-all duration-300 gap-3 relative
            ${isActive 
              ? "bg-primary1/10 text-primary1 dark:bg-primary1/10 shadow-[inset_4px_0_0_0_#1c958a] rtl:shadow-[inset_-4px_0_0_0_#1c958a]" 
              : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"}
            ${!isActuallyExpanded ? "justify-center px-0 text-center" : "pe-4"}`}
        >
          <div className={`flex items-center justify-center transition-all duration-300 ${isActive ? "scale-110 text-primary1" : "group-hover/item:text-slate-900 dark:group-hover/item:text-white"}`}>
            {item.icon}
          </div>
          
          {(isExpanded || isHovered || isMobileOpen) && (
            <>
              <span className={`text-sm font-bold flex-1 min-w-0 text-start truncate transition-opacity duration-300
                ${isActive ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                {t(item.name)}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`text-slate-400 ${isActive ? "text-primary1" : ""}`}
              >
                <ChevronDown size={16} strokeWidth={3} />
              </motion.div>
            </>
          )}

        </button>
      ) : (
        <Link
          to={item.path || "#"}
          style={{ paddingInlineStart: `${depthPadding}px` }}
          className={`flex items-center w-full py-3 transition-all duration-300 gap-3 relative
            ${isLeafSelected 
              ? "bg-primary1/10 text-primary1 dark:bg-primary1/10 shadow-[inset_4px_0_0_0_#1c958a] rtl:shadow-[inset_-4px_0_0_0_#1c958a]" 
              : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-white/5"}
            ${!isActuallyExpanded ? "justify-center px-0 text-center" : "pe-4"}`}
        >
          <div className={`flex items-center justify-center transition-all duration-300 ${isLeafSelected ? "scale-110 text-primary1" : "group-hover/item:text-slate-900 dark:group-hover/item:text-white"}`}>
            {item.icon || <div className="w-5 h-5 rounded-full border-2 border-current opacity-20" />}
          </div>

          {(isExpanded || isHovered || isMobileOpen) && (
            <>
              <span className={`text-sm font-bold flex-1 min-w-0 text-start truncate transition-opacity duration-300
                ${isLeafSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                {t(item.name)}
              </span>
              {item.badge && (
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border
                  ${item.badge.variant === 'new' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    item.badge.variant === 'pro' ? 'bg-primary1/10 text-primary1 border-primary1/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                  {t(item.badge.text)}
                </span>
              )}
            </>
          )}

        </Link>
      )}

      {/* Nested Children */}
      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (isExpanded || isHovered || isMobileOpen) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <SidebarGroup items={item.children!} depth={depth + 1} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <Tooltip text={t(item.name)} disabled={isExpanded || isHovered || isMobileOpen} position="right">
      <li className="list-none mb-0.5 w-full">
        {content}
      </li>
    </Tooltip>
  );
};

export default SidebarItem;


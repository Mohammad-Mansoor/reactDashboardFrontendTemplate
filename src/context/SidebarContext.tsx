import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface SidebarContextType {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isMobile: boolean;
  isHovered: boolean;
  openItemIds: string[];
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (hovered: boolean) => void;
  toggleOpenItem: (id: string) => void;
  setOpenItemIds: (ids: string[]) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from localStorage
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [openItemIds, setOpenItemIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("sidebar-open-items");
    return saved !== null ? JSON.parse(saved) : [];
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    localStorage.setItem("sidebar-open-items", JSON.stringify(openItemIds));
  }, [openItemIds]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const toggleOpenItem = useCallback((id: string) => {
    setOpenItemIds((prev) => 
      prev.includes(id) 
        ? prev.filter((item) => item !== id) 
        : [...prev, id]
    );
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isExpanded: isMobile ? false : isExpanded,
        isMobileOpen,
        isMobile,
        isHovered,
        openItemIds,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        toggleOpenItem,
        setOpenItemIds,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

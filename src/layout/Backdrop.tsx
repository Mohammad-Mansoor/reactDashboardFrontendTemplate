import { useSidebar } from "../context/SidebarContext";

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-white-900/50 blur lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;

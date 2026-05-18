import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useOnlineStatus } from "../utils/networkListener";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import NetworkErrorModal from "../components/modals/NetworkErrorModal";
import { useTranslation } from "react-i18next";
import { isElectron } from "../utils/isElectron";
import ElectronTitleBar from "../components/Header/ElectronTitleBar";


const LayoutContent = () => {
  const { isExpanded } = useSidebar();
  const { i18n } = useTranslation();

  const rtlLangs = ["fa", "ps", "dr"];
  const dir = rtlLangs.includes(i18n.language) ? "rtl" : "ltr";

  const { isOnline, isInitialLoad } = useOnlineStatus();
  const location = useLocation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const wasOfflineRef = useRef(false);

  // Online / Offline handling
  useEffect(() => {
    if (isInitialLoad) return;

    if (!isOnline) {
      wasOfflineRef.current = true;
      setShowNetworkModal(true);
    } else if (wasOfflineRef.current && isOnline) {
      wasOfflineRef.current = false;
      setShowNetworkModal(false);
      toast.success("You are back online.");
    }
  }, [isOnline, isInitialLoad]);

  const handleCloseNetworkModal = () => setShowNetworkModal(false);

  // RTL / LTR Direction
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language, dir]);

  // Route loading animation
  useEffect(() => {
    setIsRouteLoading(true);
    const timer = setTimeout(() => setIsRouteLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-x-hidden m-0 p-0">
      <NetworkErrorModal isOpen={showNetworkModal} onClose={handleCloseNetworkModal} />

      {/* Sidebar */}
      <>
        <AppSidebar />
        <Backdrop />
      </>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 m-0 p-0 ${
          isExpanded ? "lg:ms-[240px]" : "lg:ms-[72px]"
        } ms-0`}
      >
        <AppHeader />

        {/* Page Content */}
        <div className="flex-1 flex flex-col min-h-0 min-w-0 mx-auto w-full max-w-screen-2xl">
          <div className="flex-1 w-full min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
const AppLayout = () => {
  const { isOnline } = useOnlineStatus();
  const electron = isElectron();

  return (
    <div
      className={`m-0 p-0 w-full flex flex-col min-h-screen ${
        !isOnline ? "border-2 border-red-500" : ""
      }`}
    >
      {/* Electron-only title bar — invisible in web/browser mode */}
      {electron && <ElectronTitleBar />}

      <SidebarProvider>
        <LayoutContent />
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;

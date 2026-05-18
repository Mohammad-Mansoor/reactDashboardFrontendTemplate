import GridShape from "../../components/Common/GridShape";
import { Link } from "react-router-dom";
import ThemeTogglerTwo from "../../components/Common/ThemeTogglerTwo";
import ElectronTitleBar from "../../components/Header/ElectronTitleBar";
import { isElectron } from "../../utils/isElectron";

export default function AuthLayout({ children }) {
  return (
    // Outer wrapper — flex column so the title bar stacks above the page
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">

      {/* Electron window controls — only shown in desktop app */}
      {isElectron() && <ElectronTitleBar />}

      {/* Auth page body */}
      <div className="relative flex-1 flex flex-col justify-center w-full lg:flex-row sm:p-0">
        {children}

        {/* Right decorative panel (desktop only) */}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              <Link to="/" className="block mb-4">
                <img
                  width={231}
                  height={48}
                  src="/images/logo/auth-logo.png"
                  alt="HCMS Logo"
                />
              </Link>
              <p className="text-center text-gray-400 dark:text-white/60">
                Healthcare Management System
              </p>
            </div>
          </div>
        </div>

        {/* Theme toggler (fixed, web mode only — in Electron it's in the main app header) */}
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
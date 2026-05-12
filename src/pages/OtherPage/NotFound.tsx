import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Home,
  ArrowLeft,
  Activity,
  Heart,
  Search,
  AlertCircle,
  Stethoscope,
  Shield,
  LifeBuoy
} from "lucide-react";
import PageMeta from "../../components/Common/PageMeta";

// Theme specific background elements
const BG_ICONS = [
  { Icon: Activity, top: "15%", left: "10%", delay: 0, size: 32, color: "text-blue-light-500/20 dark:text-blue-light-500/10" },
  { Icon: Search, top: "25%", right: "15%", delay: 0.5, size: 28, color: "text-orange-500/20 dark:text-orange-500/10" },
  { Icon: Heart, bottom: "20%", left: "15%", delay: 1, size: 36, color: "text-red-500/20 dark:text-red-500/10" },
  { Icon: AlertCircle, bottom: "30%", right: "10%", delay: 1.5, size: 24, color: "text-orange-500/20 dark:text-orange-500/10" },
  { Icon: Stethoscope, top: "50%", left: "5%", delay: 2, size: 30, color: "text-success-500/20 dark:text-success-500/10" },
  { Icon: Shield, top: "45%", right: "5%", delay: 2.5, size: 26, color: "text-blue-light-500/20 dark:text-blue-light-500/10" },
];

function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {BG_ICONS.map(({ Icon, top, left, right, bottom, delay, size, color }, i) => (
        <motion.div
          key={i}
          className={`absolute ${color}`}
          style={{ top, left, right, bottom }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}
    </div>
  );
}

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title={t("error.404.pageTitle", "404 Not Found | HealthCare+")}
        description={t("error.404.pageDescription", "The requested page could not be found.")}
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-[#070b14] dark:via-[#070b14] dark:to-[#0b1224] transition-colors duration-500 z-1">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-300/20 dark:bg-blue-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-[100px]" />
        </div>

        <FloatingIcons />

        <div className="mx-auto w-full max-w-2xl text-center z-10 relative">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative inline-block mb-4"
          >
             <h1 className="text-[120px] leading-none md:text-[180px] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-light-600 via-indigo-500 to-orange-500 drop-shadow-xl dark:drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] select-none">
               404
             </h1>
             <motion.div 
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-4 border-white/20 dark:border-white/5 rounded-[40px] -z-10 blur-xl"
               animate={{ rotate: 360 }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl"
          >
            {t("error.404.title", "Oops! Page not found")}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10 text-base text-slate-600 dark:text-white/60 sm:text-lg max-w-lg mx-auto"
          >
            {t("error.404.message", "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.")}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-full gap-2 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-all bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white sm:w-auto active:scale-95 shadow-sm cursor-pointer"
            >
              <ArrowLeft size={18} />
              {t("error.404.goBack", "Go Back")}
            </button>
            <Link
              to="/"
              className="flex items-center justify-center w-full gap-2 px-6 py-3.5 text-sm font-semibold text-white transition-all bg-gradient-to-r from-blue-light-600 to-orange-500 border-none rounded-xl hover:brightness-110 sm:w-auto shadow-lg shadow-orange-500/20 active:scale-95 cursor-pointer"
            >
              <Home size={18} />
              {t("error.404.goHome", "Return to Home")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col items-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2 text-slate-400 dark:text-white/40">
              <span className="text-sm">{t("error.404.needHelp", "Need assistance?")}</span>
            </div>
            <Link to="/support" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-light-600 dark:text-blue-light-400 hover:text-blue-light-500 transition-colors">
              <LifeBuoy size={16} />
              {t("error.404.contactSupport", "Contact Customer Support")}
            </Link>
          </motion.div>

        </div>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute text-sm font-medium text-slate-400 -translate-x-1/2 bottom-6 left-1/2 dark:text-white/30 tracking-wide w-full max-w-max text-center"
        >
          &copy; {new Date().getFullYear()} HealthCare+. {t("footer.allRightsReserved", "All rights reserved.")}
        </motion.p>
      </div>
    </>
  );
}

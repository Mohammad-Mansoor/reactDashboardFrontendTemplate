import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import ThemeTogglerTwo from "../../components/Common/ThemeTogglerTwo";

/**
 * AUTH CARD COMPONENT
 * A premium, glassmorphism centered card for the auth flow.
 */
export const AuthCard = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-[#070b14] dark:via-[#070b14] dark:to-[#0b1224] p-4 relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-200/30 dark:bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-200/30 dark:bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 rounded-[32px] p-8 lg:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] dark:shadow-2xl relative overflow-hidden transition-colors duration-500">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="flex w-14 h-14 rounded-xl bg-gradient-to-br from-blue-light-50 to-orange-50 dark:from-blue-light-500/10 dark:to-orange-500/10 items-center justify-center mx-auto mb-6 border border-white dark:border-white/10 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-light-600 to-orange-500 flex items-center justify-center shadow-md">
                <Heart className="text-white" size={20} fill="white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-slate-500 dark:text-white/50 text-sm leading-relaxed px-4">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          <div className="space-y-6">{children}</div>
        </div>

        {/* Footer Link / Notice */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-white/20">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Secure Identity Portal
          </span>
        </div>
      </motion.div>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
};

export default AuthCard;

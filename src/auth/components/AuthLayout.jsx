import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShieldCheck,
  Zap,
  Shield,
  Activity,
  CheckCircle2,
  Lock,
  Stethoscope,
  ClipboardList,
  Users,
  Calendar
} from "lucide-react";
import ThemeTogglerTwo from "../../components/Common/ThemeTogglerTwo";
import { useTranslation } from "react-i18next";

/* ─── Artistic Floating Icons ─────────────────────────────────────────── */
const ART_ICONS = [
  { Icon: Activity,    top: "10%", left: "5%",   size: 40, color: "text-blue-light-400/10" },
  { Icon: Heart,       top: "20%", right: "8%",  size: 50, color: "text-orange-400/10" },
  { Icon: Stethoscope, bottom: "15%", left: "10%", size: 45, color: "text-blue-light-400/10" },
  { Icon: Shield,      bottom: "20%", right: "12%", size: 35, color: "text-orange-400/10" },
  { Icon: Zap,         top: "45%",  left: "2%",   size: 30, color: "text-blue-light-400/10" },
  { Icon: Users,       top: "50%",  right: "3%",  size: 38, color: "text-orange-400/10" },
];

const ArtisticBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-white dark:bg-[#05070a]">
    {/* Animated Blobs */}
    <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[70%] bg-blue-light-300/10 dark:bg-blue-light-900/10 rounded-full blur-[140px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[60%] bg-orange-300/10 dark:bg-orange-900/10 rounded-full blur-[120px]" />
    
    {/* Floating Icons */}
    {ART_ICONS.map(({ Icon, top, left, right, bottom, size, color }, i) => (
      <motion.div
        key={i}
        className={`absolute ${color}`}
        style={{ top, left, right, bottom }}
        animate={{ y: [0, -30, 0], rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon size={size} strokeWidth={1} />
      </motion.div>
    ))}
  </div>
);

/**
 * THE "GLASS PILLAR ISLAND"
 * A unique, centered, dual-pillar glassmorphic island.
 * Combines the sidebar and form into a single, cohesive "Security Capsule".
 */
export const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  step = 1,
  error 
}) => {
  const { t } = useTranslation();

  const steps = [
    { title: t("auth.forgotPassword"), icon: <Activity size={16} /> },
    { title: t("auth.verifyOtp"), icon: <ShieldCheck size={16} /> },
    { title: t("auth.resetPassword"), icon: <Lock size={16} /> },
  ];
console.log("this is auth error: ", error)
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      <ArtisticBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[880px] relative z-10 flex flex-col lg:flex-row bg-white/40 dark:bg-white/5 backdrop-blur-[40px] border border-white/60 dark:border-white/10 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] overflow-hidden"
      >
        
        {/* ── LEFT PILLAR: THE NAVIGATION ── */}
        <div className="w-full lg:w-[320px] p-10 lg:p-12 bg-gradient-to-br from-white/30 to-transparent dark:from-white/5 dark:to-transparent border-b lg:border-b-0 lg:border-r border-white/40 dark:border-white/5 flex flex-col">
          
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Heart className="text-white" size={22} fill="white" />
            </div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">
              Health<span className="text-blue-light-600">Care+</span>
            </h1>
          </div>

          <div className="space-y-10 relative">
             {/* Vertical Line Connector */}
             <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100 dark:bg-white/5" />
             
             {steps.map((s, i) => {
               const isActive = step === i + 1;
               const isDone = step > i + 1;
               return (
                 <div key={i} className={`flex items-center gap-6 group transition-all duration-500 ${isActive ? "translate-x-2" : "opacity-40"}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center z-10 relative transition-all duration-700
                      ${isActive 
                        ? "bg-blue-light-600 text-white shadow-[0_0_20px_rgba(var(--blue-light-600),0.4)]" 
                        : isDone ? "bg-success-500 text-white" : "bg-white dark:bg-white/10 text-gray-400"}`}>
                      {isDone ? <CheckCircle2 size={18} /> : s.icon}
                      {isActive && <motion.div layoutId="activePillar" className="absolute -inset-2 rounded-2xl border border-blue-light-500/20 animate-pulse" />}
                    </div>
                    <div className="flex flex-col">
                       <span className={`text-[12px] font-black uppercase tracking-widest ${isActive ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                         {s.title}
                       </span>
                       <span className="text-[9px] font-bold text-gray-400 dark:text-white/20 uppercase tracking-tighter">
                         {isActive ? "Active Protocol" : "Security Phase"}
                       </span>
                    </div>
                 </div>
               );
             })}
          </div>

          <div className="mt-auto pt-16">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tighter">
              AUTHENTICATE<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">IDENTITY</span>
            </h2>
          </div>
        </div>

        {/* ── RIGHT PILLAR: THE FORM ── */}
        <div className="flex-1 p-10 lg:p-14 relative flex flex-col justify-center">
           
           <header className="mb-10 text-center lg:text-left">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight tracking-tight">
                {title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed max-w-[320px]">
                {subtitle}
              </p>
           </header>

           {/* Error Alert */}
           <AnimatePresence mode="wait">
             {error && (
               <motion.div
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -10 }}
                 className="mb-8 p-3.5 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-center gap-3"
               >
                  <Shield size={16} className="text-red-500" />
                  <span className="text-red-600 dark:text-red-400 text-[11px] font-black uppercase tracking-tight">{error}</span>
               </motion.div>
             )}
           </AnimatePresence>

           <div className="relative">
              {children}
           </div>

           <div className="mt-12 flex items-center justify-center lg:justify-start gap-4 opacity-30 grayscale pointer-events-none">
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-blue-light-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">AES-256</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <div className="flex items-center gap-2">
                <Zap size={12} className="text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Instant Handshake</span>
              </div>
           </div>
        </div>

      </motion.div>

      {/* Utilities */}
      <div className="fixed bottom-8 right-8 z-50">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
};

export default AuthLayout;

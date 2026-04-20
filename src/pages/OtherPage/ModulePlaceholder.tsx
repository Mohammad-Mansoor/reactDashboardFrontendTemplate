import React from "react";
import { motion } from "framer-motion";
import { Hammer, ArrowLeft, Layout } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const ModulePlaceholder: React.FC = () => {
  const { pathname } = useLocation();
  const moduleName = pathname.split("/").filter(Boolean).pop()?.replace("-", " ") || "Module";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="relative mb-8 inline-block">
          <div className="absolute inset-0 bg-primary1/20 blur-3xl rounded-full" />
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut"
            }}
            className="relative bg-white dark:bg-white/5 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/10"
          >
            <Hammer className="text-primary1" size={64} strokeWidth={1.5} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -bottom-2 -right-2 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 p-2 rounded-xl border border-amber-200 dark:border-amber-500/30"
          >
            <Layout size={20} />
          </motion.div>
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 capitalize">
          {moduleName}
        </h1>
        
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
          We're currently architecting the <span className="text-primary1 font-semibold">{moduleName}</span> module. 
          Expect a world-class healthcare experience very soon.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary1 text-white rounded-2xl font-bold shadow-lg shadow-primary1/30 hover:shadow-primary1/50 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
          
          <button className="px-6 py-3 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
            Notify Me
          </button>
        </div>
      </motion.div>

      <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl w-full opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
         {[1, 2, 3].map(i => (
           <div key={i} className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                className="w-1/2 h-full bg-primary1/30"
              />
           </div>
         ))}
      </div>
    </div>
  );
};

export default ModulePlaceholder;

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import successAnimation from "../../components/lottieFiles/success_gif.json";
import Button from "../Ui/Ftth/Button";

const SuccessModal = ({
  isOpen,
  onClose,
  title = "Success!",
  description = "Your action was completed successfully.",
  animationData = successAnimation,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ✅ Instant Backdrop (No animation) */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-white/40 dark:bg-slate-900/60 backdrop-blur-sm"
          />

          {/* ✅ Modal Wrapper */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="
                relative
                w-full
                max-w-sm sm:max-w-md
                bg-white dark:bg-slate-900
                border border-black/[0.08] dark:border-white/[0.08]
                rounded-sm
                shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)]
                px-5 py-6 sm:px-8 sm:py-8
                text-center
                overflow-hidden
              "
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-60" />
              {/* Animation */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="w-24 h-24 sm:w-36 sm:h-36"
                />
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-[1.35rem] leading-tight font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                {title}
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-[15px] leading-relaxed text-gray-500 dark:text-gray-400 mb-6">
                {description}
              </p>

              {/* Custom Content */}
              {children && (
                <div className="mb-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-left border border-black/[0.04] dark:border-white/10 rounded-xl p-4 bg-gray-50/50 dark:bg-white/5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] max-h-40 overflow-y-auto">
                  {children}
                </div>
              )}

              {/* Button */}
              <div className="flex justify-center mt-2 w-full">
                <Button 
                  label="OK" 
                  onClick={onClose} 
                  success 
                  className="w-full sm:w-[160px]" 
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;

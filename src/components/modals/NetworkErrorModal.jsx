import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import errorAnimation from "../../components/lottieFiles/failed_task.json";

const NetworkErrorModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Instant Blur Backdrop */}
          <div className="fixed inset-0 z-40 bg-white/40 dark:bg-slate-900/60 backdrop-blur-sm" />

          {/* Modal Wrapper */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              className="
                relative
                w-full
                max-w-sm sm:max-w-md
                bg-white dark:bg-slate-800
                rounded-2xl
                shadow-2xl
                px-5 py-6 sm:px-8 sm:py-8
                text-center
              "
            >
              {/* Animation */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <Lottie
                  animationData={errorAnimation}
                  loop={true}
                  className="w-24 h-24 sm:w-36 sm:h-36"
                />
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                Internet Connection Lost
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-300 mb-4">
                Please check your internet connection and try again.
              </p>

              {/* Button */}
              <div className="flex justify-center">
                <button
                  onClick={onClose}
                  className="
                    w-full sm:w-[150px]
                    py-2.5 sm:py-3
                    text-sm sm:text-base
                    rounded-xl
                    bg-gradient-to-r from-red-500 to-rose-600
                    text-white font-semibold
                    shadow-md
                    hover:shadow-lg hover:scale-[1.02]
                    active:scale-95
                    transition-all duration-300
                  "
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NetworkErrorModal;

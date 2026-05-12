import React, { useRef, useState } from "react";

/**
 * OTP INPUT COMPONENT
 * A 6-digit specialized input with auto-focus and smooth transitions.
 */
export const OtpInput = ({ value, onChange, length = 6, error }) => {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newOtp = value.split("");
    newOtp[index] = val.substring(val.length - 1);
    const finalOtp = newOtp.join("");
    onChange(finalOtp);

    // Auto focus next
    if (val && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(data)) return;
    onChange(data);
    if (data.length === length) {
      inputs.current[length - 1].focus();
    } else {
      inputs.current[data.length].focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2.5 sm:gap-3" onPaste={handlePaste}>
        {[...Array(length)].map((_, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 outline-none
              ${
                error
                  ? "border-red-400 bg-red-50/10 text-red-500"
                  : "border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-800 dark:text-white focus:border-blue-light-500 focus:ring-4 focus:ring-blue-light-500/10"
              }`}
          />
        ))}
      </div>
      {error && (
        <p className="text-red-500 text-[13px] font-medium animate-shake text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default OtpInput;

import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

/**
 * Tooltip Component
 * Uses Portals to prevent clipping and ARIA roles for accessibility.
 */
const Tooltip = ({ children, text, position = "right", disabled = false, className = "" }) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + rect.height / 2,
        left: position === "right" ? rect.right + 10 : rect.left - 10,
      });
    }
  };

  const handleMouseEnter = () => {
    updateCoords();
    setShow(true);
  };

  return (
    <div
      ref={triggerRef}
      className={`flex items-center w-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
      onFocus={handleMouseEnter}
      onBlur={() => setShow(false)}
    >
      {children}
      {!disabled && show &&
        ReactDOM.createPortal(
          <div
            role="tooltip"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className={`fixed z-[9999] -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md shadow-xl pointer-events-none transition-opacity duration-200 ${
              position === "right" ? "" : "-translate-x-full"
            }`}
          >
            {text}
            <div 
              className={`absolute w-2 h-2 bg-gray-900 rotate-45 top-1/2 -translate-y-1/2 ${
                position === "right" ? "-left-1" : "-right-1"
              }`} 
            />
          </div>,
          document.body
        )}
    </div>
  );
};

export default Tooltip;

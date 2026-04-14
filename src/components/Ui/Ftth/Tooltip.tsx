import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  bgColor = "bg-black",
  textColor = "text-white",
  position = "bottom",
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top - tooltipRect.height - gap;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left - tooltipRect.width - gap;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + gap;
        break;
    }

    // 🔥 Prevent viewport overflow dynamically
    top = Math.max(
      8,
      Math.min(top, window.innerHeight - tooltipRect.height - 8),
    );
    left = Math.max(
      8,
      Math.min(left, window.innerWidth - tooltipRect.width - 8),
    );

    setCoords({ top, left });
  }, [visible, position]);

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>

      {createPortal(
        <div
          ref={tooltipRef}
          className={`fixed px-3 py-1 text-sm rounded-md shadow-lg whitespace-nowrap ${bgColor} ${textColor} transition-opacity duration-150 ${
            visible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{
            top: coords.top,
            left: coords.left,
            zIndex: 9999,
          }}
        >
          {text}
        </div>,
        document.body,
      )}
    </>
  );
};

export default Tooltip;

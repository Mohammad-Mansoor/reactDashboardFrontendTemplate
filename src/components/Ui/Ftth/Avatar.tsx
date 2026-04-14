import React from "react";

/**
 * Avatar Component
 *
 * Props:
 * - src: string | null -> image URL (local or server)
 * - alt: string -> alternative text for image
 * - fallback: string | ReactNode -> fallback content when no image (e.g. initials, icon)
 * - size: "sm" | "md" | "lg" -> avatar size
 * - variant: "circle" | "square" -> shape
 * - badge: {
 *     content?: string | ReactNode,  // badge text/icon
 *     position?: "top-right" | "top-left" | "bottom-right" | "bottom-left",
 *     color?: string, // dynamic color (hex, rgb, tailwind utility not needed)
 *   }
 * - className: string -> optional extra Tailwind classes
 */
export default function Avatar({
  src = null,
  alt = "avatar",
  fallback = "👤",
  size = "md",
  variant = "circle",
  badge = null,
  className = "",
}) {
  // Avatar size mapping
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  };

  // Variant mapping
  const variantClasses = {
    circle: "rounded-full",
    square: "rounded-md",
  };

  // Badge size mapping
  const badgeSizes = {
    sm: {
      dot: "h-[8px] w-[8px]",
      text: "text-[8px] px-1 py-0.5",
      ring: 3,
    },
    md: {
      dot: "h-[10px] w-[10px]",
      text: "text-[10px] px-1.5 py-0.5",
      ring: 4,
    },
    lg: {
      dot: "h-[12px] w-[12px]",
      text: "text-[12px] px-2 py-1",
      ring: 5,
    },
  };

  // Badge position mapping
  const badgePositions = {
    "top-right": "top-0 end-0 translate-x-1/2 rtl:-translate-x-1/2 -translate-y-1/2",
    "top-left": "top-0 start-0 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2",
    "bottom-right": "bottom-0 end-0 translate-x-1/2 rtl:-translate-x-1/2 translate-y-1/2",
    "bottom-left": "bottom-0 start-0 -translate-x-1/2 rtl:translate-x-1/2 translate-y-1/2",
  };

  const badgeSize = badgeSizes[size] || badgeSizes.md;

  return (
    <div
      className={`
        relative inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700
        text-gray-600 dark:text-gray-300 
        ${sizeClasses[size]} ${variantClasses[variant]} ${className}
      `}
    >
      {/* Image / fallback */}
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`object-cover w-full h-full ${variantClasses[variant]}  shadow-lg shadow-gray-400 dark:shadow-gray-700`}
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            e.currentTarget.style.display = "none"; // hide broken image
          }}
        />
      ) : (
        <span>{fallback}</span>
      )}

      {/* Badge (optional) */}
      {badge && (
        <span
          className={`
            absolute flex items-center justify-center font-semibold z-50 text-white rounded-full border border-white shadow
            ${badge.content ? badgeSize.text : `${badgeSize.dot} animate-pulse`}
            ${badgePositions[badge.position || "bottom-right"]}
          `}
          style={{
            backgroundColor: badge.color || "#22c55e", // default green
            boxShadow: `0 0 0 ${badgeSize.ring}px ${
              badge.color || "#22c55e"
            }33`, // subtle ring effect
          }}
        >
          {badge.content || ""}
        </span>
      )}
    </div>
  );
}


import { FaCheck } from "react-icons/fa";

function Checkbox({
  variant = "filled", // "filled" or "blank"
  color = "primary1", // Tailwind color string
  size = "md", // "sm" | "md" | "lg"
  value = false,
  onChange = (val) => console.log(val),
}) {
  // Size mapping - Increased for better visibility
  const sizes: Record<string, string> = {
    sm: "w-5 h-5 text-[10px]",
    md: "w-6 h-6 text-[12px]",
    lg: "w-7 h-7 text-[14px]",
  };
  const ringColors: Record<string, string> = {
    primary1: "ring-primary1/30",
    red: "ring-red-500/30",
    green: "ring-green-500/30",
    blue: "ring-blue-500/30",
    // add more as needed
  };
  const bgColors: Record<string, string> = {
    primary1: "bg-primary1", red: "bg-red-500", green: "bg-green-500", blue: "bg-blue-500"
  };
  const borderColors: Record<string, string> = {
    primary1: "border-primary1", red: "border-red-500", green: "border-green-500", blue: "border-blue-500"
  };
  const textColors: Record<string, string> = {
    primary1: "text-primary1", red: "text-red-500", green: "text-green-500", blue: "text-blue-500"
  };

  const boxSize = sizes[size] || sizes.md;
  const safeBg = bgColors[color] || "bg-primary1";
  const safeBorder = borderColors[color] || "border-primary1";
  const safeText = textColors[color] || "text-primary1";
  const safeRing = ringColors[color] || "ring-primary1/30";

  // Base classes - removed p-1 to allow bigger checkmark
  const baseClasses = `flex items-center justify-center rounded outline-none transition-all duration-300 ease-in-out cursor-pointer border-2 ${
    value ? "ring-4" : "ring-0"
  } ${safeRing} ${safeBorder}`;
  
  let boxClasses = "";

  if (variant === "filled") {
    boxClasses = value
      ? `${safeBg} ${safeBorder} text-white`
      : `bg-transparent ${safeBorder}`;
  } else {
    // blank (outline only)
    boxClasses = value
      ? `${safeBorder} ${safeText}`
      : `${safeBorder} bg-transparent`;
  }

  return (
    <div
      className={`${baseClasses} ${boxSize} ${boxClasses}`}
      onClick={() => onChange(!value)}
      role="checkbox"
      aria-checked={value}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!value);
        }
      }}
    >
      <FaCheck
        className={`transition-all duration-300 transform ${
          value ? "scale-110 opacity-100" : "scale-0 opacity-0"
        }`}
      />
    </div>
  );
}

export default Checkbox;



interface SwitchProps {
  color?: string;
  size?: "sm" | "md" | "lg";
  value?: boolean;
  onChange?: (val: boolean) => void;
}

function Switch({
  color = "primary1",
  size = "md",
  value = false,
  onChange = (val) => console.log(val),
}: SwitchProps) {
  // ✅ Size mapping
  const sizes = {
    sm: {
      track: "w-10 h-5",
      thumb: "w-4 h-4",
      translate: "translate-x-[23px]", // enough to reach right edge
    },
    md: {
      track: "w-12 h-6",
      thumb: "w-5 h-5",
      translate: "translate-x-[26px]",
    },
    lg: {
      track: "w-14 h-8",
      thumb: "w-7 h-7",
      translate: "translate-x-[26px]",
    },
  };

  // ✅ Safe Tailwind colors
  const colorMap: Record<string, string> = {
    primary1: "bg-primary1", blue: "bg-blue-500", red: "bg-red-500", green: "bg-green-500",
    yellow: "bg-yellow-500", purple: "bg-purple-500", pink: "bg-pink-500", gray: "bg-gray-500",
  };
  const borderMap: Record<string, string> = {
    primary1: "border-primary1", blue: "border-blue-500", red: "border-red-500", green: "border-green-500",
    yellow: "border-yellow-500", purple: "border-purple-500", pink: "border-pink-500", gray: "border-gray-500",
  };
  const ringMap: Record<string, string> = {
    primary1: "ring-primary1/40", blue: "ring-blue-500/40", red: "ring-red-500/40", green: "ring-green-500/40",
    yellow: "ring-yellow-500/40", purple: "ring-purple-500/40", pink: "ring-pink-500/40", gray: "ring-gray-500/40",
  };

  const activeColor = colorMap[color] || colorMap["primary1"]; // fallback
  const activeBorder = borderMap[color] || borderMap["primary1"];
  const activeRing = ringMap[color] || ringMap["primary1"];
  const { track, thumb, translate } = sizes[size] || sizes.md;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      tabIndex={0}
      onClick={() => onChange(!value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(!value);
        }
      }}
      className={`relative inline-flex ${track} items-center rounded-full transition-colors duration-300 ease-in-out 
        ${
          value
            ? `${activeColor} ring-2 ${activeRing}`
            : `bg-white dark:bg-gray-800 border ${activeBorder}`
        }
      `}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 start-0 ${thumb} rounded-full shadow-md transform transition-transform duration-300 ease-in-out
          ${value ? `${translate} bg-white rtl:-translate-x-full` : `translate-x-[2px] rtl:-translate-x-[2px] ${activeColor}`}
        `}
      />
    </button>
  );
}

export default Switch;

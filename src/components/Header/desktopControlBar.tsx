import React from "react";
import { Minus, Square, X } from "lucide-react";

const WindowControls = () => {

const send = (channel: string) => {
    console.log("CLICK:", channel);
  
    if (!window.electronAPI) {
      console.error("❌ electronAPI missing");
      return;
    }
  
    window.electronAPI.send(channel);
  };
  return (
    <div className="flex items-center gap-1">

      {/* Minimize */}
      <button
        onClick={() => send("window-minimize")}
        className="w-10 h-8 flex items-center justify-center rounded-md 
                   hover:bg-gray-200 transition-all duration-200"
      >
        <Minus size={16} />
      </button>

      {/* Maximize */}
      <button
        onClick={() => send("window-maximize")}
        className="w-10 h-8 flex items-center justify-center rounded-md 
                   hover:bg-gray-200 transition-all duration-200"
      >
        <Square size={14} />
      </button>

      {/* Close */}
      <button
        onClick={() => send("window-close")}
        className="w-10 h-8 flex items-center justify-center rounded-md 
                   hover:bg-red-500 hover:text-white transition-all duration-200"
      >
        <X size={16} />
      </button>

    </div>
  );
};

export default WindowControls;
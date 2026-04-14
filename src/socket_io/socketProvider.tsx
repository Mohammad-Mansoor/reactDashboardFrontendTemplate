import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { socket } from "./socket";

interface SocketContextType {
  socket: typeof socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
  token?: string; // JWT token
}

export const SocketProvider: React.FC<Props> = ({ children, token }) => {
  useEffect(() => {
    if (token) {
      // Connect with token
      socket.auth = { token };
      socket.connect();
    }

    return () => {
      // Optional: disconnect on unmount
      socket.disconnect();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook to use socket
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};

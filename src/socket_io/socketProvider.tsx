import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket, syncSocketAuth } from "./socket";
import { initSystemListeners } from "./listeners/system.listeners";
import { logout } from "../store/slices/authSlice";
import { RootState } from "../store/store";

interface SocketContextType {
  socket: typeof socket;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const handleConnection = async () => {
      if (accessToken) {
        // 1. Sync auth metadata (JWT, Fingerprint)
        const initialized = await syncSocketAuth();
        
        if (initialized) {
          // 2. Connect
          socket.connect();

          // 3. Register System Listeners (Session termination, security)
          initSystemListeners(() => {
            // Callback for remote logout
            dispatch(logout());
            // Note: Navigation is handled automatically by ProtectedRoute/PublicRoute 
            // reacting to the accessToken change in Redux.
          });

          console.log("[Socket] Connection initiated");
        }
      } else {
        socket.disconnect();
      }
    };

    handleConnection();

    return () => {
      socket.disconnect();
    };
  }, [accessToken, dispatch]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context.socket;
};

import { io } from "socket.io-client";
import { decodeJwt } from "../utils/jwt";
import DeviceIntelligence from "../utils/device-intelligence";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

/**
 * CORE SOCKET INSTANCE
 */
export const socket = io(SOCKET_URL, {
  autoConnect: false, // Industry practice: manually connect when auth is ready
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

/**
 * REFRESH SOCKET AUTH METADATA
 * Must be called before connection or during token refresh.
 */
export const syncSocketAuth = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;

  const payload = decodeJwt(token);
  const metrics = await DeviceIntelligence.init();

  socket.auth = {
    token,
    userId: payload?.userId,
    sessionId: payload?.sessionId,
    fingerprint: metrics?.fingerprint,
    deviceName: metrics?.deviceName,
    deviceType: metrics?.deviceType,
  };

  return true;
};

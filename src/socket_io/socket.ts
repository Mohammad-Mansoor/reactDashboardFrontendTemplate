import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // industry best practice
  transports: ["websocket"],
  auth: {
    accessToken: "YOUR_TEST_ACCESS_TOKEN",
    sessionId: "YOUR_TEST_SESSION_ID",
  },
});

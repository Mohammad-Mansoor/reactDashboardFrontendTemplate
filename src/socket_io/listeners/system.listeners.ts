import { socket } from "../socket";

/**
 * SYSTEM-WIDE SOCKET LISTENERS
 * 
 * Handles critical security and session events.
 */
export const initSystemListeners = (onSessionTerminated: () => void) => {
  // Clear any existing listeners to prevent memory leaks/duplicates
  socket.off("SESSION_TERMINATED");
  socket.off("SECURITY_CHALLENGE");

  /**
   * 1. SESSION TERMINATED (Remote Logout)
   * Triggered when this specific session is revoked by another device or administrative action.
   */
  socket.on("SESSION_TERMINATED", (data: { reason?: string }) => {
    console.warn("[Socket] Session terminated:", data.reason || "Remote logout triggered");
    
    // Wipe local credentials immediately
    localStorage.removeItem("accessToken");
    
    // Trigger the cleanup/redirect callback
    onSessionTerminated();
  });

  /**
   * 2. SECURITY CHALLENGE (Google-style verification)
   * Placeholder for the "Select the number" feature.
   */
  socket.on("SECURITY_CHALLENGE", (data: any) => {
    console.log("[Socket] Security challenge received:", data);
    // UI mapping will happen here in the next phase
  });
};

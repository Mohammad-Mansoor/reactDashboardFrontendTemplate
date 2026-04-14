import { socket } from "../socket";

type NotificationPayload = {
  id: string;
  title: string;
  message: string;
  ts: string;
};

export const initNotificationListener = (
  callback: (data: NotificationPayload) => void,
) => {
  // Remove existing listener to avoid duplicates
  socket.off("notification");

  // Listen to notification event
  socket.on("notification", (data: NotificationPayload) => {
    console.log("📩 Notification received:", data);
    callback(data);
  });
};

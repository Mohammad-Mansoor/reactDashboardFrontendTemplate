import { socket } from "../socket";

export const sendNotificationRead = (notificationId: string) => {
  socket.emit("notification.read", { id: notificationId });
};

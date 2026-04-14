import { useEffect, useState } from "react";
import { sendNotificationRead } from "../emitters/notifications";
import { initNotificationListener } from "../listeners/notifications";
// import { initNotificationListener } from "@/socket/listeners/notifications";
// import { sendNotificationRead } from "@/socket/emitters/notifications";

export type Notification = {
  id: string;
  title: string;
  message: string;
  ts: string;
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize listener
    initNotificationListener((notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
  }, []);

  const markAsRead = (id: string) => {
    sendNotificationRead(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    markAsRead,
  };
};

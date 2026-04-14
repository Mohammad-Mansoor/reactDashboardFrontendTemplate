import { useEffect } from "react";
import { useSocket } from "./socket_io/socketProvider";
// import { useSocket } from "@/socket/SocketProvider";

const SocketTest = () => {
  const socket = useSocket();

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      // Test ping → pong
      socket.emit("ping", { message: "Hello server!" });
    });

    socket.on("pong", (data) => {
      console.log("📩 Pong received:", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("pong");
      socket.off("disconnect");
    };
  }, [socket]);

  return null;
};

export default SocketTest;

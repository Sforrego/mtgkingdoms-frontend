// useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (server: string, setIsConnected: (value: boolean) => void, setIsInRoom: (value: boolean) => void) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(server);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.log("Connection error:", error);
      setTimeout(() => {
        newSocket.connect();
      }, 1000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [server, setIsConnected, setIsInRoom]);

  return { socket };
};
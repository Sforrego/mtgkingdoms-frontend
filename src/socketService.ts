import { io, Socket } from "socket.io-client";

const SERVER = process.env.REACT_APP_SERVER as string;

let socket: Socket | null = null;

export const connectSocket = () => {
  socket = io(SERVER);
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
import { AccountInfo } from "@azure/msal-browser";
import { Role } from "../Types/Role";
import { Socket } from "socket.io-client";

export const createRoom = (user: AccountInfo | null, socket: Socket | null) => {
  if (user && socket) {
    socket.emit("create", { userId: user.localAccountId, username: user.name });
  } else {
    console.log("User is not logged in or Connection not established");
  }
};

export const joinRoom = (user: AccountInfo | null, socket: Socket | null, roomCode: string) => {
  if (user && socket) {
    socket.emit("join", { userId: user.localAccountId, username: user.name, roomCode });
  } else {
    console.log("User is not logged in or Connection not established");
  }
};

export const startGame = (socket: Socket | null, roomCode: string) => {
  if (socket) {
    socket.emit("startGame", { roomCode });
  } else {
    console.log("Connection not established");
  }
};

export const leaveRoom = (user: AccountInfo | null, socket: Socket | null, roomCode: string) => {
  if (user && socket) {
    socket.emit("leaveRoom", { userId: user.localAccountId, username: user.name, roomCode });
  } else {
    console.log("User is not logged in or Connection not established");
  }
};

export const revealRole = (user: AccountInfo | null, socket: Socket | null, roomCode: string) => {
  if (user && socket) {
    socket.emit("revealRole", { userId: user.localAccountId, roomCode });
  } else {
    console.log("User is not logged in or Connection not established");
  }
};

export const updateRolesPool = (selectedRoles: Role[], socket: Socket | null, roomCode: string) => {
  if (socket) {
    socket.emit("updateRolesPool", { roles: selectedRoles, roomCode });
  } else {
    console.log("Connection not established");
  }
};

export const selectRole = (socket: Socket | null, userId: string | undefined, roomCode: string | undefined, selectedRole: Role | null) => {
  console.log("Role selected")
  if (socket) {
    socket.emit("selectRole", { userId, roomCode, selectedRole});
  } else {
    console.log("Connection not established");
  }
};
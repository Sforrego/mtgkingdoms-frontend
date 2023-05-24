import { Role } from "./Role";

export type User = {
    socketId: string;
    username: string;
    role: Role;
    isRevealed: boolean;
    userId: string;
  };

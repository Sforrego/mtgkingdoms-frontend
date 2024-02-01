import { useState, useEffect } from 'react';
import { AccountInfo } from "@azure/msal-browser";
import { Socket } from "socket.io-client";
import { handleRedirectEffect, handleAADB2C90091ErrorEffect, handleLogin, handleLogout } from "./authService";
import { leaveRoom } from "./gameService";

interface UseAuthReturn {
    isLoggedIn: boolean;
    user: AccountInfo | null;
    loginHandler: () => Promise<void>;
    logoutHandler: (user: AccountInfo | null, socket: Socket, roomCode: string) => Promise<void>;
  }

export const useAuth = (): UseAuthReturn => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<AccountInfo | null>(null);

    useEffect(() => {
        handleAADB2C90091ErrorEffect();
    }, []);

    useEffect(() => {
        handleRedirectEffect(setUser, setIsLoggedIn);
    }, [setIsLoggedIn]);

    const loginHandler = async () => {
        await handleLogin(setUser, setIsLoggedIn);
    };

    const logoutHandler = async (user: AccountInfo | null, socket: Socket, roomCode: string) => {
        console.log("logging out")
        await handleLogout(setIsLoggedIn, () => leaveRoom(user, socket, roomCode))
    };

    return { isLoggedIn, user, loginHandler, logoutHandler };
};
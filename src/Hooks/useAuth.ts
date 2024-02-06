import { useState, useEffect } from 'react';
import { AccountInfo } from "@azure/msal-browser";
import { Socket } from "socket.io-client";
import { handleRedirectEffect, handleAADB2C90091ErrorEffect, handleLogin, handleLogout } from "../Services/authService";
import { leaveRoom } from "../Services/gameService";

interface UseAuthReturn {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    accountUser: AccountInfo | null;
    setAccountUser: React.Dispatch<React.SetStateAction<AccountInfo | null>>;
    loginHandler: (socket: Socket) => Promise<void>;
    logoutHandler: (user: AccountInfo | null, socket: Socket, roomCode: string) => Promise<void>;
  }

export const useAuth = (socket: Socket | null): UseAuthReturn => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accountUser, setAccountUser] = useState<AccountInfo | null>(null);

    useEffect(() => {
        handleAADB2C90091ErrorEffect();
    }, []);

    useEffect(() => {
        if(socket){
            handleRedirectEffect(setAccountUser, setIsLoggedIn, socket);
        }
    }, [setIsLoggedIn, socket]);

    const loginHandler = async (socket: Socket) => {
        await handleLogin(setAccountUser, setIsLoggedIn, socket);
    };

    const logoutHandler = async (user: AccountInfo | null, socket: Socket, roomCode: string) => {
        console.log("logging out")
        await handleLogout(setIsLoggedIn, () => leaveRoom(user, socket, roomCode), setAccountUser);
    };

    return { isLoggedIn, setIsLoggedIn, accountUser, setAccountUser, loginHandler, logoutHandler };
};
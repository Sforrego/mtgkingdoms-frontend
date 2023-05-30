import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { io, Socket } from "socket.io-client";
import { Dispatch, SetStateAction } from "react";

const clientId = process.env.REACT_APP_MTGKINGDOMS_CLIENT_ID as string;

// Initialize the MSAL application object
const msalConfig = {
  auth: {
    clientId: clientId,
    authority:
      "https://MTGKingdoms.b2clogin.com/MTGKingdoms.onmicrosoft.com/B2C_1_signupsignin",
    knownAuthorities: ["MTGKingdoms.b2clogin.com"],
    postLogoutRedirectUri: window.location.origin,
  },
};

const myMSALObj = new PublicClientApplication(msalConfig);

// Login request
const loginRequest = {
  scopes: ["openid", "profile"],
};

export const login = async () => {
  await myMSALObj.loginRedirect(loginRequest);
};

export const logout = async () => {
  await myMSALObj.logoutRedirect();
};

export const handleRedirectPromise = async () => {
  return await myMSALObj.handleRedirectPromise();
};

export const getAllAccounts = () => {
  return myMSALObj.getAllAccounts();
};

const SERVER = process.env.REACT_APP_SERVER as string;

export const handleLoginEffect = async (
  isConnected: boolean,
  user: AccountInfo | null,
  socket: Socket | null
) => {
  if (isConnected && user && socket) {
    socket.emit("login", { userId: user.homeAccountId, username: user.name });
  }
};

export const handleAADB2C90091ErrorEffect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("error")) {
    const errorCode = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");
    // Handle "AADB2C90091: The user has cancelled entering self-asserted information"
    if (
      errorCode === "access_denied" &&
      errorDescription?.includes("AADB2C90091")
    ) {
      window.location.href = "/";
    }
  }
};

export const handleRedirectEffect = async (
  setUser: (account: AccountInfo | null) => void,
  setIsLoggedIn: (loggedIn: boolean) => void
) => {
  try {
    await handleRedirectPromise();
    const accounts = getAllAccounts();
    if (accounts.length !== 0) {
      setUser(accounts[0]);
      setIsLoggedIn(true);
    }
  } catch (error) {
    if (
      // @ts-ignore
      error?.errorCode === "access_denied" &&
      // @ts-ignore
      error?.errorMessage?.includes("AADB2C90091")
    ) {
      window.location.href = "/"; 
    }
  }
};

export const initSocketEffect = (setSocket: (socket: Socket | null) => void, setIsConnected: (connected: boolean) => void) => {
  const newSocket = io(SERVER);
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
};

export const handleLogin = async (setUser: Dispatch<SetStateAction<AccountInfo | null>>, setIsLoggedIn: Dispatch<SetStateAction<boolean>>) => {
  try {
    await handleRedirectPromise();
    const accounts = getAllAccounts();
    if (accounts.length === 0) {
      await login();
    } else {
      setUser(accounts[0]);
      setIsLoggedIn(true);
    }
  } catch (err) {
    console.log(err);
    if (
      // @ts-ignore
      err.errorCode === "access_denied" &&
      // @ts-ignore
      err.errorMessage.includes("AADB2C90091")
    ) {
      // User cancelled the sign-in or sign-up process.
      window.location.href = "/"; // Redirect to home page as an example
    }
  }
};

export const handleLogout = async (setIsLoggedIn: Dispatch<SetStateAction<boolean>>, leaveRoom: () => void) => {
  if (window.confirm("Do you really want to sign out?")) {
    leaveRoom(); // Leave the room before logging out
    await logout();
    setIsLoggedIn(false);
  }
};

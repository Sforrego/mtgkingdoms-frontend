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
  setAccountUser: (account: AccountInfo | null) => void,
  setIsLoggedIn: (loggedIn: boolean) => void,
  socket: Socket
) => {
  try {
    await handleRedirectPromise();
    const accounts = getAllAccounts();
    if (accounts.length !== 0) {
      let accountUser: AccountInfo | null = null;
      if(accounts.length > 1 && accounts[1].homeAccountId.includes("profileediting")){
        accountUser = accounts[1];
      } else {
        accountUser = accounts[0];
      }

      setAccountUser(accountUser);
      localStorage.setItem('accountUser', JSON.stringify(accountUser)); 
      setIsLoggedIn(true);
      socket.emit("login", { userId: accountUser.localAccountId, username: accountUser.name });
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

export const handleLogin = async (setUser: Dispatch<SetStateAction<AccountInfo | null>>, setIsLoggedIn: Dispatch<SetStateAction<boolean>>, socket: Socket) => {
  try {
    await handleRedirectPromise();
    const accounts = getAllAccounts();
    if (accounts.length === 0) {
      await login();
    } else {
      let accountUser = accounts[0]
      setUser(accountUser);
      setIsLoggedIn(true);
      localStorage.setItem('accountUser', JSON.stringify(accountUser));
      socket.emit("login", { userId: accountUser.localAccountId, username: accountUser.name });
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

export const handleLogout = async (setIsLoggedIn: Dispatch<SetStateAction<boolean>>, leaveRoom: () => void, setAccountUser: (acountUser: AccountInfo | null) => void) => {
  if (window.confirm("Do you really want to sign out?")) {
    console.log("Actually Logging out")
    leaveRoom();
    localStorage.removeItem('accountUser'); 
    setAccountUser(null); 
    setIsLoggedIn(false);
    await logout();
  }
};

// Add a new function for editing the user profile
export const editProfile = async () => {
  const editProfileAuthority = "https://MTGKingdoms.b2clogin.com/MTGKingdoms.onmicrosoft.com/B2C_1_profileediting"; // Replace with your actual edit profile authority
  try {
    await myMSALObj.loginRedirect({
      ...loginRequest,
      authority: editProfileAuthority,
      prompt: "login",
      state: "editProfile",
    });
  } catch (error) {
    console.error('Error during profile edit redirection:', error);
  }
};
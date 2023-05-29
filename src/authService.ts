import { PublicClientApplication } from "@azure/msal-browser";

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

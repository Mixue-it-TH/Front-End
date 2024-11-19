import { PublicClientApplication } from "@azure/msal-browser";
import { reactive } from "vue";

export const msalConfig = {
  auth: {
    clientId: "47c39d51-5351-4baa-a311-eb9c8d819070",
    authority: "https://login.microsoftonline.com/79845616-9df0-43e0-8842-e300feb2642a",
    redirectUri: "http://localhost:5173/board",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        console.log(`[MSAL Log - ${level}]: ${message}`);
      },
      piiLoggingEnabled: false,
      logLevel: 2, // Debug level
    },
  },
};

export const graphScopes = {
  scopes: ["user.read"],
};

export const state = reactive({
  isAuthenticated: false,
  user: null,
});

export const msalInstance = new PublicClientApplication(msalConfig);

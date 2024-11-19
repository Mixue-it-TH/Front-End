import { msalInstance, state, graphScopes } from "./msal";
import { InteractionStatus } from "@azure/msal-browser";

export function msalService() {
  const initialize = async () => {
    try {
      await msalInstance.initialize();
    } catch (error) {
      console.log("Initialization error", error);
    }
  };

  const login = async () => {
    try {
      // Check if MSAL is initialized before using it
      if (!msalInstance) {
        throw new Error("MSAL not initialized. Call initializeMsal() before using MSAL API.");
      }
      await msalInstance.loginRedirect({
        scopes: ["openid", "profile", "User.Read"],
      });
      state.isAuthenticated = true;
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    if (!msalInstance) {
      throw new Error("MSAL not initialized. Call initializeMsal() before using MSAL API.");
    }
    msalInstance.logoutRedirect();
    state.isAuthenticated = false;
    state.user = null;
  };

  const handleRedirect = async () => {
    try {
      const loginResponse = await msalInstance.handleRedirectPromise();
      if (loginResponse) {
        console.log("Login successful:", loginResponse);
        state.isAuthenticated = true;
        state.user = loginResponse.account; // เก็บข้อมูลผู้ใช้
        return loginResponse; // คืนค่าผลลัพธ์การล็อกอิน
      } else {
        console.log("No login response available.");
      }
    } catch (error) {
      console.error("Redirect handling error:", error);
    }
  };

  const getToken = async () => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error("No accounts found. Please login first.");
    }

    const silentRequest = {
      scopes: ["User.Read"], // หรือ Scopes ของ API ที่คุณต้องการ
      account: accounts[0], // ใช้บัญชีแรกที่พบ
    };

    try {
      const tokenResponse = await msalInstance.acquireTokenSilent(silentRequest);
      return tokenResponse.accessToken;
    } catch (error) {
      console.error("Error acquiring token silently:", error);
    }
  };

  return {
    initialize,
    login,
    logout,
    handleRedirect,
    getToken,
  };
}

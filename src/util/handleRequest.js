import {useAccount} from "@/store/account";
import getAccessToken from "./tokenUtil";

export async function handleRequestWithTokenRefresh(action, ...params) {
  const accountStore = useAccount();

  try {
    let response = await action(...params);

    if (response.status === 401) {
      console.log("============ 401 ==============");

      response = await accountStore.handleUnauthorized(action, ...params);
    }
    return response;
  } catch (error) {
    console.error("An error occurred during the request:", error);
    throw error;
  }
}
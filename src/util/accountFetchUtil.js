function getToken() {
  const token = localStorage.getItem("token");

  return token;
}
export async function login(userName, password) {
  try {
    const response = await fetch(import.meta.env.VITE_LOGIN_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorMessage = await response.text();
      return {
        status: response.status,
        message: errorMessage || "An error occurred",
      };
    }
  } catch (error) {
    console.log("error", error);
  }
}

export async function getTokenByRefreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const respone = await fetch(
      `
      ${import.meta.env.VITE_LOGIN_URL}/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (respone.ok) {
      const data = await respone.json();
      return data;
    } else {
      return respone;
    }
  } catch (error) {
    console.log("error", error);
  }
}
export async function handleVisibleMode(visibility, paramId) {
  const token = getToken();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${paramId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visibility: visibility,
        }),
      }
    );
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    }
  } catch (e) {
    console.log(`error: ${e}`);
  }
}

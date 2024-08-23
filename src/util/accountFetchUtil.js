export async function login(url, userName, password) {
  try {
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: userName,
        password: password
      })
    })

    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      return response.status
    }
  } catch (error) {
    console.log("error", error)
  }
}

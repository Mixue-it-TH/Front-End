function getToken() {
  const token = localStorage.getItem("token")

  return token
}
export async function login(userName, password) {
  try {
    const response = await fetch(import.meta.env.VITE_LOGIN_URL + "/login", {
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
      const data = await response.json()
      return data
    } else {
      const errorMessage = await response.text()
      return {
        status: response.status,
        message: errorMessage || "An error occurred"
      }
    }
  } catch (error) {
    console.log("error", error)
  }
}

export async function getTokenByRefreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken")
    const respone = await fetch(
      `
      ${import.meta.env.VITE_LOGIN_URL}/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      }
    )

    if (respone.ok) {
      const data = await respone.json()
      return data
    } else {
      return respone
    }
  } catch (error) {
    console.log("error", error)
  }
}
export async function handleVisibleMode(visibility, paramId) {
  const token = getToken()

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${paramId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          visibility: visibility
        })
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      return response
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

export async function getCollaborators(boardId) {
  const token = getToken()

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/collabs`,
      {
        method: "Get",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      return response
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

export async function getCollaboratorsByCollabId(boardId, collabId) {
  const token = getToken()

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/collabs/${collabId}`,
      {
        method: "Get",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      return response
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

export async function addCollaborator(email, access, boardId) {
  const token = getToken()

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/collabs`,
      {
        method: "Post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          access_right: access
        })
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      return response
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

export async function removeCollaborator(boardId, collabId) {
  const token = getToken()

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/collabs/${collabId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      return response
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

export async function changeAccessCollaborator(boardId, newCollab, collabId) {
  const token = getToken()

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/collabs/${collabId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: newCollab.email,
          access_right: newCollab.access_right
        })
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      return response
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

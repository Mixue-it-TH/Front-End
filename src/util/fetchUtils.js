function getToken() {
  return localStorage.getItem("token")
}

function getBoardId() {
  return localStorage.getItem("boardId")
}
const boardId = getBoardId()

async function getTaskList(paramId) {
  try {
    const token = getToken()
    const boardId = paramId

    const data = await fetch(
      `
      ${import.meta.env.VITE_BASE_URL}/${boardId}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const items = await data.json()
    return items
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function getTaskById(id, paramId) {
  try {
    const token = getToken()
    const boardId = paramId

    const data = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (data.ok) {
      return await data.json()
    } else {
      return data.status
    }
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function addTask(task, paramId) {
  try {
    console.log(task)
    const token = getToken()
    const boardId = paramId

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: task.title?.trim(),
          description: task.description?.trim(),
          assignees: task.assignees?.trim(),
          status: task.status.id
        })
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      console.log(response)

      return response.status
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

async function editTask(task, paramId) {
  try {
    const token = getToken()
    const boardId = paramId

    const respone = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${task.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: task.id,
          title: task.title?.trim(),
          description: task.description?.trim(),
          assignees: task.assignees?.trim(),
          status: task.status.id
        })
      }
    )
    if (respone.ok) {
      const responseData = await respone.json()
      return responseData
    } else {
      return respone.status
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}
async function deleteTaskById(id, paramId) {
  try {
    const token = getToken()
    const boardId = paramId

    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    if (response.ok) {
      return response
    } else return response.status
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

async function getStatusList(paramId) {
  const token = getToken()
  const boardId = paramId

  try {
    const data = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/statuses`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const items = await data.json()
    return items
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function getEnableLimit(paramId) {
  try {
    const token = getToken()
    const boardId = paramId

    const data = await fetch(
      `
      ${import.meta.env.VITE_BASE_URL}/${boardId}/statuses/islimit`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const items = await data.json()
    return items
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function getBoardIdByUserOIDs(oid) {
  try {
    const token = getToken()

    const boardId = getBoardId()

    const data = await fetch(
      `
      ${import.meta.env.VITE_BASE_URL}/user/${oid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const board = await data.json()
    return board
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function createBoard(boardName) {
  try {
    const token = getToken()
    // const boardId = getBoardId();

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: boardName
      })
    })
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      console.log(response)

      return response.status
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

export {
  getTaskList,
  getTaskById,
  addTask,
  editTask,
  deleteTaskById,
  getStatusList,
  getEnableLimit,
  getBoardIdByUserOIDs,
  createBoard
}

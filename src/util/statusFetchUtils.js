function getToken() {
  const token = localStorage.getItem("token")
  if (token) return token
}
function getBoardId() {
  return localStorage.getItem("boardId")
}

const token = getToken()
const boardId = getBoardId()

async function getStatusById(id) {
  try {
    const data = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/statuses/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    const item = await data.json()
    if (data.status === 200) {
      return item
    } else {
      return data.status
    }
  } catch (error) {
    console.log(`error: ${e}`)
  }
}

async function addStatus(newStatus) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/statuses`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newStatus.name?.trim(),
          description: newStatus.description
            ? newStatus.description.trim()
            : null,
          statusColor: newStatus.statusColor
        })
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      return response.status
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

async function editStatus(status) {
  try {
    const respone = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/statuses/${status.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: status.id,
          name: status.name?.trim(),
          description:
            status.description !== "" && status.description !== null
              ? status.description.trim()
              : null,
          statusColor: status.statusColor
        })
      }
    )
    if (respone.ok) {
      const responseData = await respone.json()
      return responseData
    } else return respone.status
  } catch (e) {
    console.log(`error: ${e}`)
  }
}
async function deleteStatusById(id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/statuses/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        method: "DELETE"
      }
    )
    if (response.ok) {
      return response
    } else return response.status
  } catch (e) {
    console.log(`error: ${e}`)
  }
}
async function deleteTaskAndTranfer(id, newId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/statuses/${id}/${newId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        method: "DELETE"
      }
    )
    return response
  } catch (e) {
    console.log(`error: ${e}`)
  }
}

async function handelLimitMaximum(isLimit, amountMaximum) {
  const token = getToken()
  console.log(boardId)

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${boardId}/statuses/maximum-task`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          limitMaximumTask: isLimit ? 1 : 0,
          noOfTasks: amountMaximum
        })
      }
    )
    if (response.ok) {
      const responseData = await response.json()
      return responseData
    } else {
      throw new Error("Failed to add status")
    }
  } catch (e) {
    console.log(`error: ${e}`)
  }
}
export {
  getStatusById,
  addStatus,
  editStatus,
  deleteTaskAndTranfer,
  deleteStatusById,
  handelLimitMaximum
}

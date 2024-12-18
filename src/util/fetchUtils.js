function getToken() {
  return localStorage.getItem("token");
}

function getBoardId() {
  return localStorage.getItem("boardId");
}
const boardId = getBoardId();

async function getTaskList(paramId) {
  try {
    const token = getToken();
    const boardId = paramId;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(
      `
      ${import.meta.env.VITE_BASE_URL}/${boardId}/tasks`,
      {
        headers,
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function getTaskById(id, paramId) {
  try {
    const token = getToken();
    const boardId = paramId;

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${id}`, {
      method: "GET",
      headers: headers,
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function addTask(task, paramId) {
  try {
    const token = getToken();
    const boardId = paramId;

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: task.title?.trim(),
        description: task.description?.trim(),
        assignees: task.assignees?.trim(),
        status: task.status.id,
      }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return response;
    }
  } catch (e) {
    console.log(`error: ${e}`);
  }
}

// async function editTask(task, paramId) {
//   console.log(task);

//   try {
//     const token = getToken();
//     const boardId = paramId;

//     const respone = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${task.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         id: task.id,
//         title: task.title?.trim(),
//         description: task.description?.trim(),
//         assignees: task.assignees?.trim(),
//         status: task.status.id,
//         files: task.files,
//       }),
//     });
//     if (respone.ok) {
//       const responseData = await respone.json();
//       return responseData;
//     } else {
//       return respone;
//     }
//   } catch (e) {
//     console.log(`error: ${e}`);
//   }
// }

// async function editTask(task, paramId) {
//   try {
//     const token = getToken();
//     const boardId = paramId;

//     const respone = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${task.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         id: task.id,
//         title: task.title?.trim(),
//         description: task.description?.trim(),
//         assignees: task.assignees?.trim(),
//         status: task.status.id,
//         fileList: task.files,
//       }),
//     });
//     if (respone.ok) {
//       const responseData = await respone.json();
//       return responseData;
//     } else {
//       return respone;
//     }
//   } catch (e) {
//     console.log(`error: ${e}`);
//   }
// }
async function editTask(task, paramId, arrayDelete) {
  try {
    const token = getToken();
    const boardId = paramId;

    const formData = new FormData();
    const editedTask = {
      id: task.id,
      title: task.title?.trim(),
      description: task.description?.trim(),
      assignees: task.assignees?.trim(),
      status: task.status.id,
      arrayDelete: arrayDelete,
    };
    formData.append("editedTask", JSON.stringify(editedTask));

    if (task.files && task.files.length > 0) {
      task.files.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return response;
    }
  } catch (e) {
    console.log(`error: ${e}`);
  }
}

async function deleteTaskById(id, paramId) {
  try {
    const token = getToken();
    const boardId = paramId;

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return response;
    } else return response;
  } catch (e) {
    console.log(`error: ${e}`);
  }
}

async function getStatusList(paramId) {
  const token = getToken();
  const boardId = paramId;

  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/statuses`, {
      headers,
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else return response;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function getVisibility(paramId) {
  try {
    const token = getToken();
    const boardId = paramId;

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function getEnableLimit(id) {
  try {
    const token = getToken();
    const boardId = id;

    const response = await fetch(
      `
      ${import.meta.env.VITE_BASE_URL}/${boardId}/statuses/islimit`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function getBoardIdByUserOIDs() {
  try {
    const token = getToken();

    const data = await fetch(
      `
      ${import.meta.env.VITE_BASE_URL}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const board = await data.json();
    return board;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

async function createBoard(boardName) {
  try {
    const token = getToken();

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: boardName,
      }),
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      return response;
    }
  } catch (e) {
    console.log(`error: ${e}`);
  }
}

async function getBoardByBoardid(boardId) {
  try {
    const token = getToken();

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return response;
    }
  } catch (e) {
    console.log(`error: ${e}`);
  }
}

// เล้งเพิ่ม
async function editTheme(boardId, newTheme) {
  const token = getToken();
  try {
    const respone = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/theme`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },

      body: JSON.stringify({
        theme: newTheme?.trim(),
      }),
    });

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

export {
  getTaskList,
  getTaskById,
  addTask,
  editTask,
  deleteTaskById,
  getStatusList,
  getEnableLimit,
  getBoardIdByUserOIDs,
  createBoard,
  getVisibility,
  getBoardByBoardid,
  editTheme,
};

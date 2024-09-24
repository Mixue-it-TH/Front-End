function getToken() {
  const token = localStorage.getItem("token");

  return token;
}

async function getStatusById(id, paramId) {
  const token = getToken();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${paramId}/statuses/${id}`,
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
    console.log(`error: ${e}`);
  }
}

async function addStatus(newStatus, paramId) {
  const token = getToken();
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${paramId}/statuses`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newStatus.name?.trim(),
          description: newStatus.description
            ? newStatus.description.trim()
            : null,
          statusColor: newStatus.statusColor,
        }),
      }
    );
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

async function editStatus(status, paramId) {
  const token = getToken();
  try {
    const respone = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${paramId}/statuses/${status.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: status.id,
          name: status.name?.trim(),
          description:
            status.description !== "" && status.description !== null
              ? status.description.trim()
              : null,
          statusColor: status.statusColor,
        }),
      }
    );
    console.log(respone);

    if (respone.ok) {
      const responseData = await respone.json();
      return responseData;
    } else return respone;
  } catch (e) {
    console.log(`error: ${e}`);
  }
}
async function deleteStatusById(id, paramId) {
  const token = getToken();
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${paramId}/statuses/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }
    );
    if (response.ok) {
      return response;
    } else return response;
  } catch (e) {
    console.log(`error: ${e}`);
  }
}
async function deleteTaskAndTranfer(id, newId, paramId) {
  const token = getToken();
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${paramId}/statuses/${id}/${newId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      }
    );
    return response;
  } catch (e) {
    console.log(`error: ${e}`);
  }
}

async function handelLimitMaximum(isLimit, amountMaximum, paramId) {
  const token = getToken();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/${paramId}/statuses/maximum-task`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limitMaximumTask: isLimit ? 1 : 0,
          noOfTasks: amountMaximum,
        }),
      }
    );
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
export {
  getStatusById,
  addStatus,
  editStatus,
  deleteTaskAndTranfer,
  deleteStatusById,
  handelLimitMaximum,
};

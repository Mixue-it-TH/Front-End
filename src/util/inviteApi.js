function getToken() {
  return localStorage.getItem("token");
}

export async function getInvitationByBoardId(boardId) {
  try {
    const token = getToken();

    const data = await fetch(
      `
        ${import.meta.env.VITE_BASE_URL}/${boardId}/collabs/invitations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const invitation = await data.json();
    return invitation;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

export async function addInvitation(email, access, boardId) {
  const token = getToken();

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/collabs/invitations`, {
      method: "Post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        accessRight: access,
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

export async function declineInvitation(boardId, oid) {
  try {
    const token = getToken();

    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/collabs/invitations/${oid}`, {
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

export async function changeAccessInvitation(boardId, oid, newAccessRight) {
  const token = getToken();

  // ตรวจสอบว่าค่า newAccessRight เป็น "WRITE" หรือ "READ" เท่านั้น
  if (newAccessRight !== "WRITE" && newAccessRight !== "READ") {
    console.error("Invalid access right. It must be 'WRITE' or 'READ'.");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${boardId}/collabs/invitations/${oid}`, {
      // ใช้ oid ที่ถูกต้อง
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessRight: newAccessRight, // ส่งค่า accessRight
      }),
    });

    if (!response.ok) {
      console.log("Error Response:", response);
      return response;
    }

    const responseData = await response.json();
    return responseData;
  } catch (e) {
    console.log(`error: ${e}`);
  }
}

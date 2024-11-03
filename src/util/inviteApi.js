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

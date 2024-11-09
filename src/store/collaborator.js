import { defineStore } from "pinia";
import { ref } from "vue";

export const useCollaborator = defineStore("collaborator", () => {
  const collabList = ref([]);
  const listCollabBoard = ref([]);

  function getListCollabBoard() {
    return listCollabBoard.value;
  }

  function setListCollabBoard(collaborator, invitation) {
    listCollabBoard.value = [...invitation, ...collaborator];
  }

  function getCollaborator() {
    return collabList.value;
  }

  function setCollaborator(collaborators, invitations) {
    collabList.value = [...collaborators, ...invitations];
  }

  function addNewCollaborator(newCollab) {
    collabList.value.push(newCollab);
  }

  function deleteCollaborator(oid) {
    const delCollab = collabList.value.findIndex((collab) => collab.oid === oid);
    collabList.value.splice(delCollab, 1);
  }

  function changeAccess(oid, newAccess) {
    const index = collabList.value.findIndex((collab) => collab.oid === oid);
    if (index !== -1) {
      collabList.value[index] = {
        ...collabList.value[index],
        accessRight: newAccess,
      };
    }
  }

  function leaveBoard(boardId) {
    const delBoardCollab = listCollabBoard.value.findIndex((boardCollab) => boardCollab.id === boardId);
    listCollabBoard.value.splice(delBoardCollab, 1);
  }

  return {
    getCollaborator,
    setCollaborator,
    addNewCollaborator,
    deleteCollaborator,
    changeAccess,
    getListCollabBoard,
    setListCollabBoard,
    leaveBoard,
  };
});

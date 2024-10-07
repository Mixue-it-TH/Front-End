import { defineStore } from "pinia"
import { ref } from "vue"

export const useCollaborator = defineStore("collaborator", () => {
  const collabList = ref([])

  function getCollaborator() {
    return collabList.value
  }

  function setCollaborator(collaborators) {
    collabList.value = collaborators
  }
  function addNewCollaborator(newCollab) {
    collabList.value = [...collabList.value, newCollab]
  }
  function deleteCollaborator(oid) {
    const delCollab = collabList.value.findIndex((collab) => collab.oid === oid)
    collabList.value.splice(delCollab, 1)
  }
  function changeAccess(oid, newAccess) {
    const index = collabList.value.findIndex((collab) => collab.oid === oid)
    if (index !== -1) {
      collabList.value[index] = {
        ...collabList.value[index],
        access_right: newAccess
      }
    }
  }

  return {
    getCollaborator,
    setCollaborator,
    addNewCollaborator,
    deleteCollaborator,
    changeAccess
  }
})

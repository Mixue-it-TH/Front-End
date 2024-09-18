import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"
export const useAccount = defineStore("account", () => {
  const token = ref("")
  const boardId = ref("")
  const boardName = ref("")
  const data = ref()
  const isLogin = ref(false)
  const router = useRouter()
  const boardList = ref([])

  function decodedToken(token) {
    if (isValidTokenToken(token)) {
      try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url?.replace(/-/g, "+")?.replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join("")
        )
        data.value = JSON.parse(jsonPayload)
      } catch (error) {
        return null
      }
    } else return null
  }

  function setToken(rawToken) {
    token.value = rawToken
    localStorage.setItem("token", token.value)
    isLogin.value = true
  }

  function getToken() {
    return token.value
  }

  function logOut() {
    localStorage.removeItem("token")
    localStorage.removeItem("boardId")
    localStorage.removeItem("boardName")
  }

  function getData() {
    return data.value
  }
  function getisLogin() {
    return isLogin.value
  }
  function setisLogin(islogin) {
    isLogin.value = islogin
  }

  function setBoardId(rawboardId) {
    boardId.value = rawboardId
  }
  function getBoardId() {
    return boardId.value
  }

  function setBoardList(boards) {
    boardList.value = boards
  }

  function getBoardList() {
    return boardList.value
  }
  function addBoard(newBoard) {
    boardList.value.push(newBoard)
  }

  function unAuthorizeHandle() {
    logOut()
    router.push("/login")
  }
  function isValidTokenToken(token) {
    const validToken = token.split(".")
    if (validToken.length < 3) {
      return false
    } else {
      return true
    }
  }

  return {
    decodedToken,
    setToken,
    getToken,
    logOut,
    getData,
    getisLogin,
    setisLogin,
    setBoardId,
    getBoardId,
    unAuthorizeHandle,
    setBoardList,
    getBoardList,
    addBoard
  }
})

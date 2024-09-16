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

  function decodedToken(token) {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join("")
    )
    data.value = JSON.parse(jsonPayload)
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

  function setBoardName(name) {
    boardName.value = name
  }

  function getBoardName() {
    return boardName.value
  }

  function unAuthorizeHandle() {
    logOut()
    router.push("/login")
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
    getBoardName,
    setBoardName,
    unAuthorizeHandle
  }
})

import { defineStore } from "pinia"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAlert } from "./alert"
import { getTokenByRefreshToken } from "@/util/accountFetchUtil"

export const useAccount = defineStore("account", () => {
  const router = useRouter()
  const alertManagement = useAlert()
  const token = ref("")
  const boardId = ref("")
  const data = ref()
  const isLogin = ref(false)
  const boardList = ref([])
  const isPublic = ref(false)
  const ownerOID = ref(null)
  const permission = ref(false)

  function setVisibility(visibility, oid) {
    isPublic.value = visibility
    ownerOID.value = oid

    // เพิ่มเงื่อนไขในการ handle จุดนี้

    if (data.value?.oid === undefined) {
      permission.value = false
      return
    }

    //กรณีไม่ใช่เจ้าของ
    if (data.value?.oid !== ownerOID.value) {
      permission.value = false
      return
    }

    // กรณีเป็นเจ้าของ
    if (data.value?.oid === ownerOID.value) {
      permission.value = true
    }
  }
  function getVisibility() {
    return isPublic.value
  }

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

  function setToken(rawToken, refreshToken) {
    token.value = rawToken
    localStorage.setItem("token", token.value)
    localStorage.setItem("refreshToken", refreshToken)
    isLogin.value = true
  }

  function getToken() {
    return token.value
  }

  function logOut() {
    localStorage.removeItem("refreshToken")
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

  async function handleUnauthorized(action, ...args) {
    const response = await reFetch(action, ...args)
    if (response.status === 401) {
      alertManagement.statusHandler(
        "error",
        `For security reasons, your session has expired. Please log back in.`
      )
      logOut()
      router.push("/login")
    } else return response
  }

  async function reFetch(action, ...args) {
    try {
      const token = await getTokenByRefreshToken()

      if (token.status === 401) {
        return token
      } else {
        localStorage.setItem("token", token.access_token)
        const response = await action(...args)
        return response
      }
    } catch (error) {
      console.error("Error fetching new token:", error)
    }
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
    setBoardList,
    getBoardList,
    addBoard,
    reFetch,
    handleUnauthorized,
    setVisibility,
    getVisibility,
    permission
  }
})

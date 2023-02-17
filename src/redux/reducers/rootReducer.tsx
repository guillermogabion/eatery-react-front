import {
  GET_LOGIN,
  IS_LOGIN,
  USER_ROLE,
  USER_DATA,
  USER_LOGOUT,
  SET_STATUS,
  SET_TOP_SEARCH,
  ROLE_ACCESS,
  UPDATE_HUMBERGER_MENU,
  SET_CURENT_ROUTE_PATH,
} from "../actions/rootAction"
import { loadState } from "../sessionStorage"
const persistedState = loadState()

interface Action {
  type: string
  payload: any
}

interface State {
  email: string
  isLogin: boolean
  userRole: string | null
  userData: any
}

const initialState: any = {
  email: "",
  isLogin: false,
  userRole: null,
  userData: {},
  status: [],
  topSearch: "",
  roleAccess: [],
  humbergerMenu: false,
  currentRoutePath: "",
  ...persistedState,
}

export default function rootReducer(state: State = initialState, action: Action) {
  const { payload, type } = action

  switch (type) {
    case GET_LOGIN:
      return { ...state, email: payload }
    case IS_LOGIN:
      return { ...state, isLogin: payload }
    case USER_ROLE:
      return { ...state, userRole: payload }
    case USER_DATA:
      return { ...state, userData: payload }
    case USER_LOGOUT:
      return { state: initialState }
    case SET_TOP_SEARCH:
      return { ...state, topSearch: payload }
    case SET_STATUS:
      return { ...state, status: payload }
    case ROLE_ACCESS:
      return { ...state, roleAccess: payload }
    case UPDATE_HUMBERGER_MENU:
      return { ...state, humbergerMenu: payload }
    case SET_CURENT_ROUTE_PATH:
      return { ...state, currentRoutePath: payload }


    default:
      return state
  }
}

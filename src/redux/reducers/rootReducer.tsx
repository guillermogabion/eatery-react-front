import {
  GET_LOGIN,
  IS_LOGIN,
  USER_ROLE,
  USER_DATA,
  USER_LOGOUT,
  SET_UNITES,
  SET_ROLES,
  SET_STATUS,
  SET_TOP_SEARCH,
  SET_MASTERLIST,
  ROLE_ACCESS,
  UPDATE_HUMBERGER_MENU,
  SET_TRANSACTION_MASTER_LIST,
  SET_CURENT_ROUTE_PATH,
  SET_LISTS_TRANSACTION_SERVICINGUNITS,
  SET_GET_USER_MASTER_LIST,
  SET_UPDATE_NOTIFICATION_DATE,
  SET_GET_HOLIDAY_MASTER_LIST,
  SET_BILLINGREPORT_MASTER_LIST,
  FRONTENDMAINTAINANCE_MASTER_LIST
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
  units: [],
  roles: [],
  status: [],
  topSearch: "",
  masterData: {},
  roleAccess: [],
  humbergerMenu: false,
  masterDataTransaction: {},
  currentRoutePath: "",
  transaction_servicingunits: [],
  user_master_Data: {},
  notificationUpdateDate: "",
  holiday_master_Data: {},
  billingreport_master_Data: {},
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
    case SET_UNITES:
      return { ...state, units: payload }
    case SET_ROLES:
      return { ...state, roles: payload }
    case SET_TOP_SEARCH:
      return { ...state, topSearch: payload }
    case SET_STATUS:
      return { ...state, status: payload }
    case SET_MASTERLIST:
      return { ...state, masterData: payload }
    case SET_TRANSACTION_MASTER_LIST:
      return { ...state, masterDataTransaction: payload }
    case ROLE_ACCESS:
      return { ...state, roleAccess: payload }
    case UPDATE_HUMBERGER_MENU:
      return { ...state, humbergerMenu: payload }
    case SET_CURENT_ROUTE_PATH:
      return { ...state, currentRoutePath: payload }
    case SET_LISTS_TRANSACTION_SERVICINGUNITS:
      return { ...state, transaction_servicingunits: payload }
    case SET_GET_USER_MASTER_LIST:
      return { ...state, user_master_Data: payload }
    case SET_GET_HOLIDAY_MASTER_LIST:
      return { ...state, holiday_master_Data: payload }
    case SET_BILLINGREPORT_MASTER_LIST:
      return { ...state, billingreport_master_Data: payload }
    case SET_UPDATE_NOTIFICATION_DATE:
      return { ...state, notificationUpdateDate: payload }
    case FRONTENDMAINTAINANCE_MASTER_LIST:
      return { ...state, frontendmaintainance_master_data: payload }


    default:
      return state
  }
}

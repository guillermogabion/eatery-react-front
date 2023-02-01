import { combineReducers } from "redux"
import rootReducer from "./rootReducer"

export default combineReducers({ rootReducer })

export type RootState = ReturnType<typeof rootReducer>

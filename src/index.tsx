import "core-js/modules/es.promise"
import "core-js/modules/es.object.assign"
import "core-js/modules/es.object.keys"
import "react-app-polyfill/ie11"
import "react-app-polyfill/stable"
import React from "react"
import ReactDOM from "react-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import { Router } from "react-router-dom"
import { history } from "./helpers"
import { Provider } from "react-redux"
import store from "./redux/store"
import routes from "./routes"
import { saveState } from "./redux/sessionStorage";

store.subscribe(() => {
  const { rootReducer }: any = store.getState()
  if (localStorage.getItem("_as175errepc")) {
    saveState({
      userData: rootReducer && rootReducer.userData,
      units: rootReducer && rootReducer.units,
      roles: rootReducer && rootReducer.roles,
      status: rootReducer && rootReducer.status,
      masterData: rootReducer && rootReducer.masterData,
      masterDataTransaction: rootReducer && rootReducer.masterDataTransaction,
      currentRoutePath: rootReducer && rootReducer.currentRoutePath,
      masterList: rootReducer && rootReducer.masterList
      // user_master_Data: rootReducer && rootReducer.user_master_Data,
      // holiday_master_Data: rootReducer && rootReducer.holiday_master_Data,
      // billingreport_master_Data: rootReducer && rootReducer.billingreport_master_Data,
      // frontendmaintainance_master_data: rootReducer && rootReducer.frontendmaintainance_master_data,
    })
  }
})

window.onerror = function (msg, url, lineNo, columnNo, error) {
  // ... handle error ...
  return true
}

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router history={history}>{routes}</Router>
  </Provider>,
  document.getElementById("root")
)

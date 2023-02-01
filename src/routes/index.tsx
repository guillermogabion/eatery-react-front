import { Route, Switch } from "react-router-dom"
import Privateroutes from "./Privateroutes"

const routes: any = (
  <Switch>
    <Route path="/" component={Privateroutes} />
    <Route path="/:someParam" component={Privateroutes} />
  </Switch>
)

export default routes

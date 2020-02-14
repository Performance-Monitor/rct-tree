import * as React from 'react'
import { HashRouter as Router, Redirect, Route, Switch, withRouter } from 'react-router-dom'
import { hot } from 'react-hot-loader/root'

import PageLoading from './../components/PageLoading'

let routes: any[] = []

try {
  const context = require.context(`../modules`, true, /.*\/routes\.tsx?$/)
  context.keys().forEach((key: string) => {
    const route = context(key).default
    routes = routes.concat(route)
  })
} catch (err) {
  console.warn(err.message)
}

class SwitchRouterComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <React.Suspense fallback={<PageLoading />}>
        <Switch>
          {routes.map((route, index) =>
            route.redirect ? (
              <Redirect exact={true} key={index} from={route.path} to={route.redirect} />
            ) : (
              <Route key={index} path={route.path} exact={false} component={route.component} />
            )
          )}
        </Switch>
      </React.Suspense>
    )
  }
}

const WithRouterComponent = withRouter(SwitchRouterComponent)

class RouterComponent extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <Router>
        <WithRouterComponent />
      </Router>
    )
  }
}

export default hot(RouterComponent)

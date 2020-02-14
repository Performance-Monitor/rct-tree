import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import './../style/reset.css'
import RouterComponent from './router'

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
        <RouterComponent />
    )
  }
}

export default hot(App)

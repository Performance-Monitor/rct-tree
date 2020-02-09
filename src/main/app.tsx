import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import promise from 'redux-promise-middleware'
import thunk from 'redux-thunk'

import reducers from '../store/reducers'
import './../style/reset.css'
import RouterComponent from './router'

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk, promise)))

class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return (
      <Provider store={store}>
        <RouterComponent />
      </Provider>
    )
  }
}

export default hot(App)

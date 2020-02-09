import { createHashHistory } from 'history'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './app'
import sensors from '../library/sensors'

window.sensors = sensors
window.router = createHashHistory()

ReactDOM.render(<App />, document.getElementById('app'))

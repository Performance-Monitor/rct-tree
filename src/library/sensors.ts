import sensors from 'sa-sdk-javascript'
import config from '../config/sensor'

import { getJWT } from './utils'
import env from '../config/env'

function patch() {
  try {
    if (env.ENV === 'dev' || env.ENV === 'local') {
      throw Error('feature和本地环境，不需要真实埋点，使用mock')
    }

    sensors.init(config)

    sensors.tracks = function() {
      const jwt = getJWT()
      if (jwt && jwt.oid) {
        const uid = jwt.oid
        sensors.login(uid)
        sensors.quick('autoTrack')
      }
      sensors.track.apply(this, arguments)
    }

    return sensors
  } catch (e) {
    const sensors: object = {
      tracks: (eventName: string, eventOption: object) => {
        console.log(`>>>[sensor-tracker]:\n eventName: ${eventName},\n eventOption: ${JSON.stringify(eventOption)}`)
      }
    }
    return sensors
  }
}

const tracker = patch()

export default tracker

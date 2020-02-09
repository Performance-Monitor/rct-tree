import { handleActions } from 'redux-actions'
import * as types from './actionTypes'
import { IState } from './type'

const initialState: IState = {
  text: 'compa'
}

export default handleActions<any, any>(
  {
    [`${types.changeCompText}`]: (state, action) => ({
      ...state,
      ...action.payload.data
    }),
    [`${types.getDemo}_FULFILLED`]: (state, action) => {
      return {
        ...state,
        ...action.payload.data
      }
    },
    [`${types.getDemo}_REJECTED`]: (state, action) => {
      return {
        ...state
      }
    }
  },
  initialState
)

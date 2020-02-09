import { createAction } from 'redux-actions'
import * as types from './actionTypes'

// 同步action
export const changeCompText = createAction(
  types.changeCompText,
  (text: string) => ({
    data: {
      text
    }
  })
)

// 异步action .getDemo
export const getDemo = createAction(types.getDemo, (id: string | number) => {
  return window.apis.getDemo({
    rest: {
      id
    }
  })
})

// 异步action dispatch  .getDemoParallel
export const getDemoParallel = (id: string | number) => {
  return async (dispatch: any, getState: any) => {
    const { data } = await window.apis.getDemo({
      rest: {
        id
      }
    })

    if (data) {
      dispatch(changeCompText('getDemoParallel'))
    }
  }
}

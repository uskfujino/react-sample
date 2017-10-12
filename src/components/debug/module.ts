import { Action } from 'redux'

export interface DebugState {
  count: number
}

enum ActionNames {
  COUNT_UP = 'debug/count-up'
}

interface CountUpAction extends Action {
  type: ActionNames.COUNT_UP
}
export const countUp = (): CountUpAction => ({
  type: ActionNames.COUNT_UP
})

export type DebugActions = CountUpAction

const initialState: DebugState = {
  count: 0
}

export default function reducer(state: DebugState = initialState, action: DebugActions): DebugState {
  switch (action.type) {
    case ActionNames.COUNT_UP:
      return Object.assign({}, state, { count: state.count + 1 })
    default:
      return state
  }
}

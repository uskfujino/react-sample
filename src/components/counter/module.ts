import { Action } from 'redux'

enum ActionNames {
  UPDATE = 'counter/update',
  EDIT_LEFT = 'counter/edit:left',
  EDIT_RIGHT = 'counter/edit:right',
  INC = 'counter/increment',
  DEC = 'counter/decrement',
  FETCH_START = 'counter/fetch_request_start',
  FETCH_FINISH = 'counter/fetch_request_finish'
}

interface EditLeftAction extends Action {
  type: ActionNames.EDIT_LEFT
  value: string
}
export const editLeft = (value: string): EditLeftAction => ({
  type: ActionNames.EDIT_LEFT,
  value: value
})

interface EditRightAction extends Action {
  type: ActionNames.EDIT_RIGHT
  value: string
}
export const editRight = (value: string): EditRightAction => ({
  type: ActionNames.EDIT_RIGHT,
  value: value
})

interface IncrementAction extends Action {
  type: ActionNames.INC
  plusAmount: number
}
export const incrementAmount = (amount: number): IncrementAction => ({
  type: ActionNames.INC,
  plusAmount: amount
})

interface DecrementAction extends Action {
  type: ActionNames.DEC
  minusAmount: number
}
export const decrementAmount = (amount: number): DecrementAction => ({
  type: ActionNames.DEC,
  minusAmount: amount
})

interface UpdateAction extends Action {
  type: ActionNames.UPDATE
  amount: number
}
export const updateAmount = (amount: number): UpdateAction => ({
  type: ActionNames.UPDATE,
  amount: amount
})

interface FetchRequestStartAction extends Action {
  type: ActionNames.FETCH_START
}
export const fetchRequestStart = (): FetchRequestStartAction => ({
  type: ActionNames.FETCH_START
})

interface FetchRequestFinishAction extends Action {
  type: ActionNames.FETCH_FINISH
}
export const fetchRequestFinish = (): FetchRequestFinishAction => ({
  type: ActionNames.FETCH_FINISH
})

export interface CounterState {
  num: number
  loadingCount: number
  pendingLeftNum: boolean
  leftText: string
  pendingRightNum: boolean
  rightText: string
}

export type CounterActions = UpdateAction
  | IncrementAction
  | DecrementAction
  | FetchRequestStartAction
  | FetchRequestFinishAction
  | EditLeftAction
  | EditRightAction

const initialState: CounterState = {
  num: 0,
  loadingCount: 0,
  pendingLeftNum: false,
  leftText: '',
  pendingRightNum: false,
  rightText: '',
}

export default function reducer(state: CounterState = initialState, action: CounterActions): CounterState {
  switch (action.type) {
    case ActionNames.EDIT_LEFT:
      return Object.assign({}, state, {leftText: action.value, pendingLeftNum: true})
    case ActionNames.EDIT_RIGHT:
      return Object.assign({}, state, {rightText: action.value, pendingRightNum: true})
    case ActionNames.UPDATE:
      return Object.assign({}, state, {
        num: action.amount,
        pendingLeftNum: false,
        leftText: '',
        // leftText: action.amount.toString(),
        pendingRightNum: false,
        rightText: ''
        // rightText: action.amount.toString()
      })
    case ActionNames.INC:
      return Object.assign({}, state, {num: state.num + action.plusAmount})
    case ActionNames.DEC:
      return Object.assign({}, state, {num: state.num - action.minusAmount})
    case ActionNames.FETCH_START: {
      return Object.assign({}, state, {loadingCount: state.loadingCount + 1})
    }
    case ActionNames.FETCH_FINISH: {
      return Object.assign({}, state, {loadingCount: state.loadingCount - 1})
    }
    default:
      return state
  }
}

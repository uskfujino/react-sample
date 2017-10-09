import counter, { CounterActions, CounterState } from './components/counter/module'
import { createStore, combineReducers, Action } from 'redux'

export default createStore(
  combineReducers({
    counter
  })
)

export interface ReduxState {
  counter: CounterState
}

export type ReduxAction = CounterActions | Action

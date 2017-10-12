import counter, { CounterActions, CounterState } from './components/counter/module'
import jobQueue, { JobQueueActions, JobQueueState } from './components/job-queue/module'
import debug, { DebugActions, DebugState } from './components/debug/module'
import { createStore, combineReducers, Action } from 'redux'

export default createStore(
  combineReducers({
    counter,
    jobQueue,
    debug
  })
)

export interface ReduxState {
  counter: CounterState,
  jobQueue: JobQueueState,
  debug: DebugState
}

export type ReduxAction = CounterActions | JobQueueActions | DebugActions | Action

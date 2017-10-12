import { Action } from 'redux'
import { v4 as uuidv4 } from 'uuid'

export enum JobStatus {
  QUEUED, STARTING, RUNNING, DONE
}

export interface Job {
  id: string
  name: string
  func: () => Promise<void>
  status: JobStatus
  error?: Error
}

export interface JobQueueState {
  maxWorkers: number
  workers: number
  pendingJobs: Job[]
  runningJobs: Job[]
  errorJobs: Job[]
}

enum ActionNames {
  PUSH = 'job-queue/push',
  START = 'job-queue/start',
  CLEAN = 'job-queue/clean',
  RUN = 'job-queue/run',
  SUCCESS = 'job-queue/success',
  ERROR = 'job-queue/error'
}

interface PushAction extends Action {
  type: ActionNames.PUSH
  name: string
  func: () => Promise<void>
}
export const push = (nm: string, fn: () => Promise<void>): PushAction => ({
  type: ActionNames.PUSH,
  name: nm,
  func: fn
})

interface StartAction extends Action {
  type: ActionNames.START
}
export const start = (): StartAction => ({
  type: ActionNames.START
})

interface CleanAction extends Action {
  type: ActionNames.CLEAN
}
export const clean = (): CleanAction => ({
  type: ActionNames.CLEAN
})

interface RunAction extends Action {
  type: ActionNames.RUN
  id: string
}
export const run = (id: string): RunAction => ({
  type: ActionNames.RUN,
  id: `${id}`
})

interface SuccessAction extends Action {
  type: ActionNames.SUCCESS
  id: string
}
export const success = (id: string): SuccessAction => ({
  type: ActionNames.SUCCESS,
  id: `${id}`
})

interface ErrorAction extends Action {
  type: ActionNames.ERROR
  id: string
  error: Error
}
export const error = (id: string, err: Error): ErrorAction => ({
  type: ActionNames.ERROR,
  id: `${id}`,
  error: err
})

export type JobQueueActions =
  PushAction | StartAction | RunAction | CleanAction | SuccessAction | ErrorAction

const initialState: JobQueueState = {
  maxWorkers: 4,
  workers: 4,
  pendingJobs: [],
  runningJobs: [],
  errorJobs: []
}

export default function reducer(state: JobQueueState = initialState, action: JobQueueActions): JobQueueState {
  switch (action.type) {
    case ActionNames.PUSH:
      {
        const newJobs = state.pendingJobs.concat([{
          id: uuidv4(),
          name: action.name,
          func: action.func,
          status: JobStatus.QUEUED
        }])

        return Object.assign({}, state, { pendingJobs: newJobs })
      }
    case ActionNames.START:
      {
        if (state.pendingJobs.length <= 0) {
          return state
        }

        if (state.workers <= 0) {
          return state
        }

        const targetJobs = state.pendingJobs.slice(0, state.workers)
                                            .map((job) => Object.assign({}, job, { status: JobStatus.STARTING }))

        const newPendingJobs = state.pendingJobs.slice(state.workers)

        const newRunningJobs = state.runningJobs.concat(targetJobs)

        const availableWorkers = state.maxWorkers - newRunningJobs.length

        return Object.assign({}, state, {
          runningJobs: newRunningJobs,
          pendingJobs: newPendingJobs,
          workers: availableWorkers
        })
      }
    case ActionNames.CLEAN:
      {
        const newErrorJobs = state.runningJobs.filter((job) => job.status === JobStatus.DONE && job.error !== undefined)

        const newRunningJobs = state.runningJobs.filter((job) => job.status !== JobStatus.DONE)

        const availableWorkers = state.maxWorkers - newRunningJobs.length

        return Object.assign({}, state, {
          workers: availableWorkers,
          runningJobs: newRunningJobs,
          errorJobs: state.errorJobs.concat(newErrorJobs)
        })
      }
    case ActionNames.RUN:
      {
        const newRunningJobs = state.runningJobs.map((job: Job) => {
          return job.id !== action.id ? job : Object.assign({}, job, { status: JobStatus.RUNNING })
        })

        return Object.assign({}, state, { runningJobs: newRunningJobs })
      }
    case ActionNames.SUCCESS:
      {
        const newRunningJobs = state.runningJobs.map((job: Job) => {
          return job.id !== action.id ? job : Object.assign({}, job, { status: JobStatus.DONE })
        })

        return Object.assign({}, state, { runningJobs: newRunningJobs })
      }
    case ActionNames.ERROR:
      {
        const newJobs = state.runningJobs.map((job: Job) => {
          return job.id !== action.id ? job : Object.assign({}, job, {
            status: JobStatus.DONE,
            error: action.error || Error(`Unknown Error name=${job.name} id=${job.id}`)
          })
        })

        return Object.assign({}, state, { runningJobs: newJobs })
      }
    default:
      return state
  }
}

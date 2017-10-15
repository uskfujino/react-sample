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
  UPDATE = 'job-queue/update',
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

interface UpdateAction extends Action {
  type: ActionNames.UPDATE
}
export const update = (): UpdateAction => ({
  type: ActionNames.UPDATE
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
  PushAction | UpdateAction | RunAction | SuccessAction | ErrorAction

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
    case ActionNames.UPDATE:
      {
        const newStartingJobs = state.pendingJobs.slice(0, state.workers)
                                                 .map((job) => Object.assign({}, job, { status: JobStatus.STARTING }))

        const newPendingJobs = state.pendingJobs.slice(state.workers)

        const newErrorJobs = state.errorJobs.concat(
          state.runningJobs.filter((job) => job.status === JobStatus.DONE && job.error !== undefined)
        )

        // RunningJob: Remove finished jobs, add starting jobs
        const newRunningJobs = state.runningJobs.filter((job) => job.status !== JobStatus.DONE).concat(newStartingJobs)

        const availableWorkers = state.maxWorkers - newRunningJobs.length

        return Object.assign({}, state, {
          runningJobs: newRunningJobs,
          pendingJobs: newPendingJobs,
          errorJobs: newErrorJobs,
          workers: availableWorkers
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

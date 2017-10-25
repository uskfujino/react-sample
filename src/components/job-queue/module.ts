import { Action } from 'redux'
import { v4 as uuidv4 } from 'uuid'

export enum JobStatus {
  QUEUED, STARTING, RUNNING, CANCELLING, DONE
}

export interface Job {
  id: string
  name: string
  func: () => Promise<void>
  cancel: () => Promise<void>
  status: JobStatus
  error?: Error
  opened: boolean
}

export interface JobQueueState {
  maxWorkers: number
  workers: number
  pendingJobs: Job[]
  runningJobs: Job[]
  errorJobs: Job[]
  cancelJobs: Job[]
}

enum ActionNames {
  PUSH = 'job-queue/push',
  UPDATE = 'job-queue/update',
  RUN = 'job-queue/run',
  SUCCESS = 'job-queue/success',
  ERROR = 'job-queue/error',
  OPEN_CLOSE = 'job-queue/open-close',
  DELETE = 'job-queue/delete',
  CANCEL = 'job-queue/cancel'
}

const defaultCancel: () => Promise<void> = () => {
  return new Promise<void>((resolve, reject) => {
    resolve()
  })
}

interface PushAction extends Action {
  type: ActionNames.PUSH
  name: string
  func: () => Promise<void>
  cancel: () => Promise<void>
}
export const push = (
  nm: string,
  fn: () => Promise<void>,
  cancelFunc: () => Promise<void> = defaultCancel
): PushAction => ({
  type: ActionNames.PUSH,
  name: nm,
  func: fn,
  cancel: cancelFunc
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

interface OpenCloseAction extends Action {
  type: ActionNames.OPEN_CLOSE
  id: string
  opened: boolean
}
export const open = (id: string): OpenCloseAction => ({
  type: ActionNames.OPEN_CLOSE,
  id: `${id}`,
  opened: true
})
export const close = (id: string): OpenCloseAction => ({
  type: ActionNames.OPEN_CLOSE,
  id: `${id}`,
  opened: false
})

interface DeleteAction extends Action {
  type: ActionNames.DELETE
  id: string
}
export const del = (id: string): DeleteAction => ({
  type: ActionNames.DELETE,
  id: `${id}`
})

interface CancelAction extends Action {
  type: ActionNames.CANCEL
  id: string
}
export const cancel = (id: string): CancelAction => ({
  type: ActionNames.CANCEL,
  id: `${id}`
})

export type JobQueueActions =
  PushAction | UpdateAction | RunAction | SuccessAction | ErrorAction | OpenCloseAction | DeleteAction | CancelAction

const initialState: JobQueueState = {
  maxWorkers: 4,
  workers: 4,
  pendingJobs: [],
  runningJobs: [],
  errorJobs: [],
  cancelJobs: []
}

export default function reducer(state: JobQueueState = initialState, action: JobQueueActions): JobQueueState {
  switch (action.type) {
    case ActionNames.PUSH:
      {
        const newJobs = state.pendingJobs.concat([{
          id: uuidv4(),
          name: action.name,
          func: action.func,
          cancel: action.cancel,
          status: JobStatus.QUEUED,
          opened: false
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
        const newRunningJobs = state.runningJobs.filter(
          (job) => job.status !== JobStatus.DONE && job.status !== JobStatus.CANCELLING
        ).concat(newStartingJobs)

        const newCancellingJobs = state.runningJobs.filter((job) => job.status === JobStatus.CANCELLING)
          .concat(state.cancelJobs)

        const availableWorkers = state.maxWorkers - newRunningJobs.length

        return Object.assign({}, state, {
          runningJobs: newRunningJobs,
          pendingJobs: newPendingJobs,
          errorJobs: newErrorJobs,
          cancellingJobs: newCancellingJobs,
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
    case ActionNames.OPEN_CLOSE:
      {
        const changeOpened = (jobs: Job[]): Job[] => {
          return jobs.map((job: Job) => {
            return job.id !== action.id ? job : Object.assign({}, job, { opened: action.opened })
          })
        }

        return Object.assign({}, state, {
          runningJobs: changeOpened(state.runningJobs),
          pendingJobs: changeOpened(state.pendingJobs),
          errorJobs: changeOpened(state.errorJobs)
        })
      }
    case ActionNames.DELETE:
      {
        const deleteTarget = (jobs: Job[]): Job[] => {
          return jobs.filter((job) => job.id !== action.id)
        }

        return Object.assign({}, state, {
          runningJobs: deleteTarget(state.runningJobs),
          pendingJobs: deleteTarget(state.pendingJobs),
          errorJobs: deleteTarget(state.errorJobs)
        })
      }
    case ActionNames.CANCEL:
      {
        const cancelTarget = (jobs: Job[]): Job[] => {
          return jobs.map((job: Job) => {
            return job.id !== action.id ? job : Object.assign({}, job, { status: JobStatus.CANCELLING })
          })
        }

        return Object.assign({}, state, {
          runningJobs: cancelTarget(state.runningJobs),
          pendingJobs: cancelTarget(state.pendingJobs)
        })
      }
    default:
      return state
  }
}

import { JobQueue } from './JobQueue'
import { connect, MapDispatchToPropsParam, MapStateToPropsParam } from 'react-redux'
import { Dispatch } from 'redux'
import { Job, JobQueueState, JobStatus, update, run, success, error, open, close, del, cancel } from './module'
import { ReduxAction, ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router'

export class ActionDispatcher {
  constructor(private dispatch: (action: ReduxAction) => void) { }

  public update(state: JobQueueState): void {
    this.dispatch(update())

    const startingJobs = state.runningJobs.filter((job) => job.status === JobStatus.STARTING)

    startingJobs.forEach((job) => {
      this.dispatch(run(job.id))

      job.func().then(() => {
        this.dispatch(success(job.id))
      }).catch((err: Error) => {
        this.dispatch(error(job.id, err))
      })
    })
  }

  public open(id: string): void {
    this.dispatch(open(id))
  }

  public close(id: string): void {
    this.dispatch(close(id))
  }

  public del(id: string): void {
    this.dispatch(del(id))
  }

  public cancel(job: Job): void {
    if (job.status !== JobStatus.RUNNING) {
      this.dispatch(del(job.id))
    }

    this.dispatch(cancel(job.id))

    job.cancel().then(() => {
      this.dispatch(del(job.id))
    }).catch((err: Error) => {
      this.dispatch(error(job.id, err))
    })
  }
}

const mapStateToProps: MapStateToPropsParam<{ value: JobQueueState }, any> =
  (state: ReduxState, ownProps: RouteComponentProps<undefined>) => {
    return { value: state.jobQueue }
  }

const mapDispatchToProps: MapDispatchToPropsParam<{ actions: ActionDispatcher }, {}> =
  (dispatch: Dispatch<ReduxAction>) => ({ actions: new ActionDispatcher(dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(JobQueue)

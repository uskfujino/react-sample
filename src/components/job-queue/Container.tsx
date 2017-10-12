import { JobQueue } from './JobQueue'
import { connect, MapDispatchToPropsParam, MapStateToPropsParam } from 'react-redux'
import { Dispatch } from 'redux'
// import { JobQueueState, push, start, clean } from './module'
import { JobQueueState, JobStatus, push, start, clean, run, success, error } from './module'
import { ReduxAction, ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router'

export class ActionDispatcher {
  constructor(private dispatch: (action: ReduxAction) => void) { }

  public push(name: string, func: () => Promise<void>): void {
    this.dispatch(push(name, func))
  }

  // public notifyUpdate(): void {
  //   this.dispatch(notifyUpdate())
  // }

  public update(state: JobQueueState): void {
    this.dispatch(clean())
    this.dispatch(start())

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
}

const mapStateToProps: MapStateToPropsParam<{ value: JobQueueState }, any> =
  (state: ReduxState, ownProps: RouteComponentProps<undefined>) => {
    return { value: state.jobQueue }
  }

const mapDispatchToProps: MapDispatchToPropsParam<{ actions: ActionDispatcher }, {}> =
  (dispatch: Dispatch<ReduxAction>) => ({ actions: new ActionDispatcher(dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(JobQueue)

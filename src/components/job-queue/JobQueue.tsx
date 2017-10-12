import * as React from 'react'
import { JobQueueState, Job } from './module'
import { ActionDispatcher } from './Container'
// import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import { css } from 'aphrodite'
import styles from './Styles'

interface Props {
  value: JobQueueState
  actions: ActionDispatcher
}

export class JobQueue extends React.Component<Props, {}> {
  private jobComponent(jobs: Job[]) {
    return jobs.map((job: Job) => {
      return (
        <div className={css(styles.job)}>
          <Paper zDepth={1}>
            {job.name} {job.status}
          </Paper>
        </div>
      )
    })
  }

  componentDidMount(): void {
    setInterval(() => this.props.actions.update(this.props.value), 1000)
    // setInterval(() => this.props.actions.notifyUpdate(), 1000)
    // const timer = setInterval(() => this.props.actions.notifyUpdate(), 1000)
  }

  // componentWillUnmount(): void {
  //   // clearInterval(this.timer);
  // }

  render() {
    // this.props.actions.update(this.props.value)

    return (
      <div className={css(styles.page)}>
        <h1>Running</h1>
        {this.jobComponent(this.props.value.runningJobs)}
        <h1>Waiting</h1>
        {this.jobComponent(this.props.value.pendingJobs)}
        <h1>Error</h1>
        {this.jobComponent(this.props.value.errorJobs)}
      </div>
    )
    // return (
    //   <div className={css(styles.page)}>
    //     {this.jobComponent([])}
    //   </div>
    // )
  }
}

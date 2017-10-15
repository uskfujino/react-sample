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
  private jobComponent(name: string, jobs: Job[]) {
    if (jobs.length <= 0) {
      return null
    }

    const title = <h2>{name}</h2>
    const cards = jobs.map((job: Job) => {
      return (
        <div className={css(styles.job)}>
          <Paper zDepth={1}>
            {job.name} {job.status}
          </Paper>
        </div>
      )
    })
    return [title].concat(cards)
  }

  componentDidMount(): void {
    setInterval(() => this.props.actions.update(this.props.value), 1000)
  }

  // componentWillUnmount(): void {
  //   // clearInterval(this.timer);
  // }

  render() {
    return (
      <div className={css(styles.page)}>
        {this.jobComponent('Running', this.props.value.runningJobs)}
        {this.jobComponent('Waiting', this.props.value.pendingJobs)}
        {this.jobComponent('Failed', this.props.value.errorJobs)}
      </div>
    )
  }
}

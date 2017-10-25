import * as React from 'react'
import { JobQueueState, Job } from './module'
import { ActionDispatcher } from './Container'
// import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { css } from 'aphrodite'
import styles from './Styles'

interface Props {
  value: JobQueueState
  actions: ActionDispatcher
}

export class JobQueue extends React.Component<Props, {}> {
  private dialogActions(job: Job) {
    const closeButton = <FlatButton label='Close' primary={true} onClick={() => this.props.actions.close(job.id)} />

    const cancelButton = <FlatButton label='Cancel' primary={false} onClick={() => this.props.actions.cancel(job)} />

    if (job.error === undefined) {
      return [closeButton, cancelButton]
    }

    const deleteButton = <FlatButton label='Delete' primary={false} onClick={() => this.props.actions.del(job.id)} />

    return [closeButton, deleteButton]
  }

  private jobComponent(name: string, jobs: Job[]) {
    if (jobs.length <= 0) {
      return null
    }

    const jobCards = jobs.map((job: Job) => {
      const detailMessage = (
        <div>
          <ul>
            <li>Name: {job.name}</li>
            <li>Status: {job.status}</li>
          </ul>
        </div>
      )

      const errorMessage = (job.error === undefined) ? null : (
        <div>
          <h1>Error</h1>
          {job.error.stack}
        </div>
      )

      return (
        <div className={css(styles.job)}>
          <Paper zDepth={1}>
            {job.name} {job.status}
            <RaisedButton label='...' onClick={() => this.props.actions.open(job.id)} />
            <Dialog title='Details' actions={this.dialogActions(job)} modal={true} open={job.opened} >
              {detailMessage}
              {errorMessage}
            </Dialog>
          </Paper>
        </div>
      )
    })

    return (
      <div className={css(styles.jobContainer)}>
        <h2>{name}</h2>
        {jobCards}
      </div>
    )
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
        {this.jobComponent('Cancelling', this.props.value.cancelJobs)}
        {this.jobComponent('Failed', this.props.value.errorJobs)}
      </div>
    )
  }
}

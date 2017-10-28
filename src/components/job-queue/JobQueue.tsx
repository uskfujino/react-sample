import * as React from 'react'
import { JobQueueState, Job, JobStatus } from './module'
import { ActionDispatcher } from './Container'
// import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
// import RaisedButton from 'material-ui/RaisedButton'
// import IconButton from 'material-ui/IconButton'
// import FontIcon from 'material-ui/FontIcon'
import * as FontAwesome from 'react-fontawesome'
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

      const statusIcon = () => {
        switch (job.status) {
          case JobStatus.DONE:
            return <FontAwesome name={job.error ? 'exclamation-triangle' : 'check'} />
          // case JobStatus.RUNNING:
          default:
            return <FontAwesome name='circle-o-notch' spin='true' />
          // default:
          // return ''
        }
      }

      // const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
      //   e.stopPropagation()
      const onCancel = () => {
        if (job.error === undefined) {
          this.props.actions.cancel(job)
        } else {
          this.props.actions.del(job.id)
        }
      }

      return (
        <Paper zDepth={1} className={css(styles.job)}>
          <div className={css(styles.button)} onClick={() => this.props.actions.open(job.id)}>
            {statusIcon()}
          </div>
          {job.name} {job.status}
          <div className={css(styles.button)} onClick={onCancel}>
            <FontAwesome name='window-close' />
          </div>
          <Dialog title='Details' actions={this.dialogActions(job)} modal={true} open={job.opened} >
            {detailMessage}
            {errorMessage}
          </Dialog>
        </Paper>
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

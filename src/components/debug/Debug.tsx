import * as React from 'react'
import { DebugState } from './module'
import { ActionDispatcher } from './Container'
import { css } from 'aphrodite'
import styles from './Styles'
import RaisedButton from 'material-ui/RaisedButton'

interface Props {
  value: DebugState
  actions: ActionDispatcher
}

export class Debug extends React.Component<Props, {}> {
  render() {
    return (
      <div className={css(styles.page)}>
        <RaisedButton
          className={css(styles.button)}
          label='Success'
          onClick={() => this.props.actions.dummy(true, this.props.value.count)}
        />
        <RaisedButton
          className={css(styles.button)}
          label='Failure'
          onClick={() => this.props.actions.dummy(false, this.props.value.count)}
        />
      </div>
    )
  }
}

import * as React from 'react'
import { CounterState } from './module'
import { ActionDispatcher } from './Container'
// import TextArea from 'react-textarea-autosize'
import RaisedButton from 'material-ui/RaisedButton'

interface Props {
  value: CounterState
  actions: ActionDispatcher
  param?: string
}

export class Counter extends React.Component<Props, {}> {
  render() {
    return (
      <div>
        {(this.props.param === undefined) ? null : <div>{this.props.param}</div>}
        <p>{`score: ${this.props.value.num}`}</p>
        <RaisedButton label='Default' />
        {/* <RaisedButton label='Default' style={style} /> */}
        <button onClick={() => this.props.actions.increment(3)}>Increment 3</button>
        <button onClick={() => this.props.actions.decrement(2)}>Decrement 2</button>
        <button onClick={() => this.props.actions.asyncIncrement()}>async Increment 100</button>
        {/* <input type="text" value={this.getLeftVal()} onChange={e => this.onChangeInput(e)}/> */}
        {/* <TextArea value={this.getRightVal()} onChange={e => this.onChangeTextArea(e)} /> */}
        {/* <input type="text" value={this.props.value.num.toString()} onChange={e => this.onChangeInput(e)}/> */}
        {/* <TextArea value={this.props.value.num.toString()} onChange={e => this.onChangeTextArea(e)} /> */}
        {(this.props.value.loadingCount === 0) ? null : <p>loading</p>}
      </div>
    )
  }
}

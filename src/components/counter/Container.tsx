import { Counter } from './Counter'
import { connect, MapDispatchToPropsParam, MapStateToPropsParam } from 'react-redux'
import { Dispatch } from 'redux'
import { CounterState, editLeft, editRight, decrementAmount, fetchRequestFinish, fetchRequestStart, incrementAmount, updateAmount } from './module'
import { ReduxAction, ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router'

export class ActionDispatcher {
  constructor(private dispatch: (action: ReduxAction) => void) {}

  myHeaders = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  })

  public editLeft(value: string): void {
    this.dispatch(editLeft(value))
  }

  public editRight(value: string): void {
    this.dispatch(editRight(value))
  }

  public update(amount: number): void {
    this.dispatch(updateAmount(amount))
  }

  public increment(amount: number): void {
    this.dispatch(incrementAmount(amount))
  }

  public decrement(amount: number): void {
    this.dispatch(decrementAmount(amount))
  }

  public async asyncIncrement(): Promise<void> {
    this.dispatch(fetchRequestStart())

    try {
      const response: Response = await fetch('/api/count', {
        method: 'GET',
        headers: this.myHeaders
      })

      if (response.ok) { // 2xx
        const json: {amount: number} = await response.json()
        this.dispatch(incrementAmount(json.amount))
      } else {
        throw new Error(`illegal status code: ${response.status}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      this.dispatch(fetchRequestFinish())
    }
  }
}

const mapStateToProps: MapStateToPropsParam<{value: CounterState, param?: string}, any> =
  (state: ReduxState, ownProps: RouteComponentProps<{myParams: string | undefined}>) => {
    if (ownProps.match.params.myParams === undefined) {
      return {value: state.counter}
    }
    return {value: state.counter, param: ownProps.match.params.myParams}
  }

const mapDispatchToProps: MapDispatchToPropsParam<{actions: ActionDispatcher}, {}> =
  (dispatch: Dispatch<ReduxAction>) => ({actions: new ActionDispatcher(dispatch)})

export default connect(mapStateToProps, mapDispatchToProps)(Counter)

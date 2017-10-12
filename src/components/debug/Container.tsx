import { Debug } from './Debug'
import { connect, MapDispatchToPropsParam, MapStateToPropsParam } from 'react-redux'
import { Dispatch } from 'redux'
import { DebugState, countUp } from './module'
import { push } from '../job-queue/module'
import { ReduxAction, ReduxState } from '../../store'
import { RouteComponentProps } from 'react-router'

export class ActionDispatcher {
  constructor(private dispatch: (action: ReduxAction) => void) { }

  public dummy(status: boolean, count: number): void {
    const name = status ? 'success' : 'fail'

    this.dispatch(push(`dummy ${name} ${count}`, () => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (status) {
            resolve()
          } else {
            reject(Error('dummy failure'))
          }
        }, 3000)
      })
    }))
    this.dispatch(countUp())
  }
}

const mapStateToProps: MapStateToPropsParam<{ value: DebugState }, any> =
  (state: ReduxState, ownProps: RouteComponentProps<undefined>) => {
    return { value: state.debug }
  }

const mapDispatchToProps: MapDispatchToPropsParam<{ actions: ActionDispatcher }, {}> =
  (dispatch: Dispatch<ReduxAction>) => ({ actions: new ActionDispatcher(dispatch) })

export default connect(mapStateToProps, mapDispatchToProps)(Debug)

import * as React from 'react'
import { Counter } from '../Counter'
import { shallow } from 'enzyme'
import { CounterState } from '../module'
import { ActionDispatcher } from '../Container'

describe('Counter', () => {

  it('rendering', () => {
    const actions: any = {}
    const state: CounterState = {num: 1, loadingCount: 1, pendingLeftNum: false, pendingRightNum: false, leftText: '1', rightText: '1'}
    const wrapper = shallow(<Counter value={state} actions={actions} />)
    expect(wrapper.find('p').at(0).prop('children')).toBe('score: 1')
    expect(wrapper.find('p').at(1).prop('children')).toBe('loading')
  })

  it('click', () => {
    const actionSpy = new ActionDispatcher(null!)
    spyOn(actionSpy, 'increment')
    const state: CounterState = {num: 0, loadingCount: 0, pendingLeftNum: false, pendingRightNum: false, leftText: '1', rightText: '1'}
    const wrapper = shallow(<Counter value={state} actions={actionSpy} />)
    wrapper.find('button').at(0).simulate('click')
    expect(actionSpy.increment).toHaveBeenCalledWith(3)
  })
})

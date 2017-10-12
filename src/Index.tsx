import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router } from 'react-router'
import store from './store'
import { Provider } from 'react-redux'
import createBrowserHistory from 'history/createBrowserHistory'
import { Routes } from './Routes'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

const history = createBrowserHistory()

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router history={history}>
        <Routes />
      </Router>
    </MuiThemeProvider>
  </Provider>
  , document.getElementById('app')
)

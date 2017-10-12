import * as React from 'react'
import { Switch } from 'react-router'
import { Link, Route } from 'react-router-dom'
import Counter from './components/counter/Container'
import Debug from './components/debug/Container'
import NotFound from './NotFound'
import AppBar from 'material-ui/AppBar'
import { AppBarProps } from 'material-ui'
import JobQueue from './components/job-queue/Container'

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
// import FlatButton from 'material-ui/FlatButton'
// import Toggle from 'material-ui/Toggle'
import NavMenuIcon from 'material-ui/svg-icons/navigation/menu'
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
// import NavigationClose from 'material-ui/svg-icons/navigation/close'
import { css } from 'aphrodite'
import styles from './Styles'

const Logged = (props: AppBarProps) => (
  <IconMenu
    {...props}
    iconButtonElement={<IconButton><NavMenuIcon /></IconButton>}
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <Link to='/' ><MenuItem primaryText='Home' /></Link>
    <Link to='/counter' ><MenuItem primaryText='Counter' /></Link>
    <Link to='/counter/papaparam' ><MenuItem primaryText='Counter with param' /></Link>
    <Link to='/debug' ><MenuItem primaryText='Debug' /></Link>
  </IconMenu>
)

// Logged.muiName = 'IconMenu'

export class Routes extends React.Component<{}, {}> {

  render() {
    return (
      <div>
        <AppBar
          title='Persona'
          iconClassNameRight='muidocs-icon-navigation-expand-more'
          iconElementRight={<Logged />}
        />
        <div className={css(styles.page)}>
          <div className={css(styles.main)}>
            <Switch >
              <Route exact={true} path='/debug' component={Debug} />
              <Route exact={true} path='/counter' component={Counter} />
              <Route path='/counter/:myParams' component={Counter} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <div className={css(styles.sideBar)}>
            <JobQueue />
          </div>
        </div>
      </div>
    )
  }
}

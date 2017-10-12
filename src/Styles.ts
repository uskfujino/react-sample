import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  page: {
    display: 'flex',
    // flexDirection: 'row',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  main: {
    flex: 1
  },
  sideBar: {
    // width: '100px',
    padding: '5px 5px 0 5px'
  }
})

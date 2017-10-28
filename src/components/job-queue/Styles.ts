import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  page: {
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  jobContainer: {
    padding: '3px 0',
    display: 'flex',
    flexFlow: 'column nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  job: {
    padding: '0 0 3px 0',
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  button: {
    ':hover': {
      color: 'blue',
      cursor: 'pointer'
    }
    // display: 'block',
    // borderRadius: '50%',
    // border: '1px solid'
  }
})

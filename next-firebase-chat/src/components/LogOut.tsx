import { Button } from '@material-ui/core'
import firebase from '../lib/firebase'

function LogOut() {
  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('successfully logged out')
      })
      .catch((error) => {
        console.log(`An error occurred (${error})`)
      })
  }

  return (
    <>
      <Button color="inherit" onClick={signOut}>
        Logout
      </Button>
    </>
  )
}

export default LogOut

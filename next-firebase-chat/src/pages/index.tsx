import Head from 'next/head'
import Image from 'next/image'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from '../lib/firebase'
import FirebaseAuth from '../components/FirebaseAuth'
import LogOut from '../components/LogOut'
import ChatRoom from '../components/ChatRoom'
import { AppBar, Button, Toolbar, IconButton, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import indexStyles from '../styles/components/index.module.css'

export default function Home() {
  const [user] = useAuthState(firebase.auth())

  if (user) {
    console.log(user)
    return (
      <div>
        <Head>
          <title>Test Next App</title>
        </Head>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <LogOut />
          </Toolbar>
        </AppBar>
        <section className={indexStyles.appSection}>
          <ChatRoom />
        </section>
      </div>
    )
  } else {
    return (
      <div className={indexStyles.top}>
        <Head>
          <title>Login Page</title>
        </Head>
        <h2>next firebase chat app</h2>
        <div className={indexStyles.login}>
          <FirebaseAuth />
        </div>
      </div>
    )
  }
}

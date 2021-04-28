import Head from 'next/head'
import Image from 'next/image'
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from '../lib/firebase'
import FirebaseAuth from '../components/FirebaseAuth'
import LogOut from '../components/LogOut'
import ChatRoom from '../components/ChatRoom'
import indexStyles from '../styles/components/index.module.css'

export default function Home() {
  const [user] = useAuthState(firebase.auth())

  if (user) {
    console.log(user)
    return (
      <div className={indexStyles.app}>
        <Head>
          <title>Test Next App</title>
        </Head>
        <header className={indexStyles.appHeader}>
          <LogOut />
        </header>

        <section className={indexStyles.appSection}>
          {/* <p>{user.email}</p> */}
          {/* <Image priority src={user.photoURL} height={120} width={120} /> */}
          {/* <h1>Hi, {user.displayName} You're successfully Logged in!</h1> */}

          <ChatRoom />
        </section>
      </div>
    )
  } else {
    return (
      <div>
        <h1>Please Log in</h1>
        <FirebaseAuth />
      </div>
    )
  }
}

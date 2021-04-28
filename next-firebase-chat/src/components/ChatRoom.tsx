import React, { useRef, useState } from 'react'
import firebase from 'firebase/app'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import ChatMessage from './ChatMessage'
import SendIcon from '@material-ui/icons/Send'
import ImageIcon from '@material-ui/icons/Image'
import chatroomStyles from '../styles/components/chatroom.module.css'

function ChatRoom() {
  const dummy: any = useRef()
  const auth = firebase.auth()
  const firestore = firebase.firestore()
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limit(25)

  const [messages] = useCollectionData(query, { idField: 'id' })
  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <main className={chatroomStyles.main}>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <div>
        <form onSubmit={sendMessage} className={chatroomStyles.form}>
          <ImageIcon />
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
            className={chatroomStyles.input}
          />

          <button type="submit" disabled={!formValue} className={chatroomStyles.button}>
            <SendIcon color="primary" />
          </button>
        </form>
      </div>
    </>
  )
}

export default ChatRoom

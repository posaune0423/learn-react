import React, { useRef, useState } from 'react'
import firebase from '../lib/firebase'
import 'firebase/storage'
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
  const [fileFormData, setfileFormData] = useState()
  const hasImage = fileFormData ? true : false

  const sendMessage = async (e) => {
    e.preventDefault()

    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      attachment: fileFormData ? fileFormData.name : null
    })

    setFormValue('')
    setfileFormData('')
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  const saveImage = (file) => {
    const storageRef = firebase.storage().ref()
    const fileRef = storageRef.child(file.name)
    fileRef.put(file).then((result) => {
      // console.log(result)
    })
  }

  const setImage = (e) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    setfileFormData(file)
    saveImage(file)
  }

  const clickInput = () => {
    document.getElementById('image_input').click()
  }

  return (
    <>
      <main className={chatroomStyles.main}>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <div>
        <form onSubmit={sendMessage} className={chatroomStyles.form}>
          <div className={chatroomStyles.image}>
            <ImageIcon color={hasImage ? 'disabled' : 'primary'} onClick={clickInput} />
            <input
              type="file"
              accept="image/*,.png,.jpg,.jpeg,.gif"
              id="image_input"
              value=""
              onChange={(e) => setImage(e)}
            />
          </div>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
            className={chatroomStyles.input}
          />

          <button type="submit" disabled={!formValue && !fileFormData} className={chatroomStyles.button}>
            <SendIcon color="primary" />
          </button>
        </form>
      </div>
    </>
  )
}

export default ChatRoom

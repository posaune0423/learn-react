import firebase from '../lib/firebase'
import 'firebase/storage'
import chatmessageStyles from '../styles/components/chatmessage.module.css'
import { Avatar } from '@material-ui/core'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function ChatMessage(props) {
  const { text, uid, photoURL, attachment } = props.message
  const messageClass = uid === firebase.auth().currentUser.uid ? 'sent' : 'received'
  const [fetchedImage, setfetchedImage] = useState('/../../../public/images/nouser.jpg')

  const getImage = (filename) => {
    const fileRef = firebase.storage().ref(filename)
    fileRef
      .getDownloadURL()
      .then((path) => {
        console.log(path)
        setfetchedImage(path)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    attachment && getImage(attachment)
  })

  return (
    <>
      <div className={`message ${messageClass}`}>
        <Avatar
          src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
          className={chatmessageStyles.img}
        />
        <p className={chatmessageStyles.p}>
          {text}
          {text && <br />}
          {attachment && (
            <a href={fetchedImage}>
              <Image src={fetchedImage} width={84} height={84} />
            </a>
          )}
        </p>
      </div>
      <style jsx>{`
        .message {
          display: flex;
          align-items: center;
        }

        .sent {
          flex-direction: row-reverse;
        }

        .sent p {
          color: #23223;
          background: #e8e8e8;
          align-self: flex-end;
        }

        .received p {
          color: black;
          background: #e8e8e8;
        }
      `}</style>
    </>
  )
}

export default ChatMessage

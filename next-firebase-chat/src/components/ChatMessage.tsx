import firebase from 'firebase/app'
import chatmessageStyles from '../styles/components/chatmessage.module.css'
import { Avatar } from '@material-ui/core'

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message
  const messageClass = uid === firebase.auth().currentUser.uid ? 'sent' : 'received'

  return (
    <>
      <div className={`message ${messageClass}`}>
        <Avatar
          src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
          className={chatmessageStyles.img}
        />
        <p className={chatmessageStyles.p}>{text}</p>
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

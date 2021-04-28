import firebase from 'firebase/app'
import chatmessageStyles from '../styles/components/chatmessage.module.css'

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message
  const messageClass = uid === firebase.auth().currentUser.uid ? 'sent' : 'received'

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
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
          color: white;
          background: #0b93f6;
          align-self: flex-end;
        }

        .received p {
          background: #e5e5ea;
          color: black;
        }
      `}</style>
    </>
  )
}

export default ChatMessage

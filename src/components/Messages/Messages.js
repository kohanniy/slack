import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ref, serverTimestamp, onChildAdded, push, child, update, off } from 'firebase/database';
import { db } from '../../firebase';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';
import Spinner from '../../Spinner';

function Messages() {
  const [messages, setMessages] = useState();
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const currentChannel = useSelector(state => state.channel.currentChannel);
  const currentUser = useSelector(state => state.user.currentUser);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setMessage(value)
  };

  const messageData = {
    timestamp: serverTimestamp(),
    user: {
      id: currentUser.uid,
      name: currentUser.displayName,
      avatar: currentUser.photoURL
    },
    content: message,
  };

  const sendMessage = async () => {
    if (message) {
      setLoading(true);
      const newMessageKey = push(child(ref(db), 'messages')).key;
      const updates = {};
      updates[`/messages/${currentChannel.id}/${newMessageKey}`] = messageData;
      try {
        await update(ref(db), updates)
        setErrors([]);
      } catch (err) {
        setErrors([...errors, err])
      }
      finally {
        setLoading(false);
        setMessage('');
      }
    } else {
      setErrors([...errors, { message: 'Напишите что-нибудь' }])
    }
  };

  const addMessageListener = useCallback(() => {
    let loadedMessages = [];
    if (currentChannel) {
      const messagesRef = ref(db, `messages/${currentChannel.id}`);
      setMessagesLoading(true);
      onChildAdded(messagesRef, (data) => {
        loadedMessages.push(data.val());
        setMessages(loadedMessages);
        setMessagesLoading(false);
      });
    }
  }, [currentChannel]);

  const removeMessageListener = useCallback(() => {
    if (currentChannel) {
      const messagesRef = ref(db, `messages/${currentChannel.id}`);
      off(messagesRef, 'child_added')
    }
  }, [currentChannel]);

  const displayMessages = (messages) => {
    if (messages && messages.length > 0) {
      return messages.map((message) => (
        <Message
          key={message.timestamp}
          message={message}
          currentUser={currentUser}
        />
      ))
    }
  }

  useEffect(() => {
    addMessageListener();
    return () => removeMessageListener()
  }, [addMessageListener, removeMessageListener]);

  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className='messages'>
          {
            messagesLoading ? (
              <Spinner />
            ) : displayMessages(messages)
          }
          {displayMessages(messages)}
        </Comment.Group>
        <MessagesForm
          handleChange={handleChange}
          errors={errors}
          message={message}
          loading={loading}
          sendMessage={sendMessage}
        />
      </Segment>
    </>
  )
}

export default Messages;

import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { serverTimestamp } from 'firebase/database';
import { saveDataToDatabase, childAddedListener, removeListeners } from '../../firebase/firebaseApi';
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
    content: message,
    user: {
      id: currentUser.uid,
      name: currentUser.displayName,
      avatar: currentUser.photoURL
    },
  };

  const sendMessage = async () => {
    if (message) {
      setLoading(true);
      try {
        await saveDataToDatabase(
          'messages', 
          `messages/${currentChannel.id}`, 
          messageData
        );

        setErrors([]);
      } catch (err) {
        setErrors([...errors, err]);
      } finally {
        setLoading(false);
        setMessage('');
      }
    } else {
      setErrors([...errors, { message: 'Напишите что-нибудь' }])
    }
  };

  const handleMessageAdded = useCallback((data) => {
    let loadedMessages = [];
    data.forEach((item) => {
      loadedMessages.push(item.val())
    });
    setMessages(loadedMessages);
    setMessagesLoading(false);
  }, []);

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
    childAddedListener(`messages/${currentChannel?.id}`, handleMessageAdded);
    
    return () => removeListeners(`messages/${currentChannel?.id}`)
  }, [currentChannel, handleMessageAdded]);

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

import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  saveDataToDatabase, 
  childAddedListener, 
  removeListeners,
  dispatchTime,
  saveMediaFilesToStorage,
  setMediaUploadProgressWatcher,
  getLinkToUploadedFile,
} from '../../firebase/firebaseApi';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';
import Spinner from '../../Spinner';
import { v4 as uuidv4 } from 'uuid';

function Messages() {
  const [ messages, setMessages ] = useState();
  const [ messagesLoading, setMessagesLoading ] = useState(true);
  const [ message, setMessage ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ errors, setErrors ] = useState([]);
  const [ uploadState, setUploadState ] = useState('');
  const [ uploadTask, setUploadTask ] = useState(null);
  const [ percentUploaded, setPercentUploaded ] = useState(0);

  const currentChannel = useSelector(state => state.channel.currentChannel);
  const currentUser = useSelector(state => state.user.currentUser);

  const handleChange = (evt) => {
    const value = evt.target.value;
    setMessage(value)
  };

  const createMessageData = useCallback((fileURL = null) => {
    const messageData = {
      timestamp: dispatchTime,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      },
    };

    if (fileURL !== null) {
      messageData.image = fileURL;
    } else {
      messageData.content = message;
    }

    return messageData;
  }, [currentUser, message]);

  const uploadFile = (file, metadata) => {
    const filePath = `chat/public/${uuidv4()}.jpg`;

    setUploadState('uploading');
    setUploadTask(saveMediaFilesToStorage(filePath, file, metadata))
  };

  const sendMessage = useCallback(async (fileURL = null) => {
    const savedData = createMessageData(fileURL);
    if (message || fileURL) {
      setLoading(true);
      try {
        await saveDataToDatabase(
          'messages',
          `messages/${currentChannel.id}`,
          savedData
        );

        setErrors([]);
        if (fileURL) {
          setUploadState('done');
        }
      } catch (err) {
        setErrors([...errors, err]);
      } finally {
        setLoading(false);
        setMessage('');
      }
    } else {
      setErrors([...errors, { message: 'Напишите что-нибудь' }])
    }
  }, [createMessageData, currentChannel, errors, message]);

  const handleUploadProgress = (progress) => setPercentUploaded(progress);

  const handleUploadError = useCallback((error) => {
    setErrors([...errors, error]);
    setUploadState('error');
    setUploadTask(null);
  }, [errors]);

  const handleUploadSuccess = useCallback(async (ref) => {
    try {
      const downLoadURL = await getLinkToUploadedFile(ref);
      sendMessage(downLoadURL);
      setUploadTask(null);
    } catch (err) {
      setErrors([...errors, err]);
      setUploadState('error');
      setUploadTask(null);
    }
  }, [errors, sendMessage]);

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
  };

  useEffect(() => {
    childAddedListener(`messages/${currentChannel?.id}`, handleMessageAdded);
    
    return () => removeListeners(`messages/${currentChannel?.id}`)
  }, [currentChannel, handleMessageAdded]);

  useEffect(() => {
    if (uploadTask !== null) {
      setMediaUploadProgressWatcher(
        uploadTask,
        handleUploadProgress,
        handleUploadError,
        handleUploadSuccess
      );
    }
  }, [handleUploadError, handleUploadSuccess, uploadTask]);

  return (
    <>
      <MessagesHeader />
      <Segment>
        <Comment.Group className={uploadState === 'uploading' ? 'messages__progress' : 'messages'}>
          {
            messagesLoading ? (
              <Spinner />
            ) : displayMessages(messages)
          }
        </Comment.Group>
        <MessagesForm
          uploadFile={uploadFile}
          handleChange={handleChange}
          errors={errors}
          message={message}
          loading={loading}
          sendMessage={sendMessage}
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />
      </Segment>
    </>
  )
}

export default Messages;

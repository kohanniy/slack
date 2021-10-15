import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  saveDataToDatabase, 
  dispatchTime,
  saveMediaFilesToStorage,
  setMediaUploadProgressWatcher,
  getLinkToUploadedFile,
} from '../../firebase/firebaseApi';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';
import { v4 as uuidv4 } from 'uuid';
import { declOfNum } from '../../utils/utils';
import { participantForms } from '../../utils/constants';
import useChildAddedListener from '../../hooks/useChildAddedListener';

function Messages() {
  const currentChannel = useSelector(state => state.channel.currentChannel);
  const currentUser = useSelector(state => state.user.currentUser);

  const {data: messages} = useChildAddedListener(`messages/${currentChannel?.id}`)

  const [ message, setMessage ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const [ errors, setErrors ] = useState([]);
  const [ uploadState, setUploadState ] = useState('');
  const [ uploadTask, setUploadTask ] = useState(null);
  const [ percentUploaded, setPercentUploaded ] = useState(0);
  const [ numUniqueUsers, setNumUniqueUsers ] = useState('');
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ searchLoading, setSearchLoading ] = useState(false);
  const [ searchResults, setSearchResults ] = useState([]);

  const handleChange = evt => setMessage(evt.target.value);

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

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }

      return acc;
    }, []);

    const numUniqueUsers = `${uniqueUsers.length} ${declOfNum(uniqueUsers.length, participantForms)}`;
    setNumUniqueUsers(numUniqueUsers)
  }

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

  const handleSearchMessages = useCallback(() => {
    const regex = new RegExp(searchTerm, 'gi');
    const searchResults = messages.reduce((acc, message) => {
      if (message.content && message.content.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResults(searchResults);
    setSearchLoading(false);
  }, [messages, searchTerm]);

  useEffect(() => {
    countUniqueUsers(messages)
  }, [messages]);

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

  useEffect(() => {
    handleSearchMessages();
  }, [handleSearchMessages]);

  const displayChannelName = channel => channel ? `#${channel.name}` : '';

  const handleSearchChange = (evt) => {
    setSearchTerm(evt.target.value);
    setSearchLoading(true);
  };

  return (
    <>
      <MessagesHeader 
        channelName={displayChannelName(currentChannel)}
        numUniqueUsers={numUniqueUsers}
        handleChange={handleSearchChange}
        searchLoading={searchLoading}
      />
      <Segment>
        <Comment.Group className={uploadState === 'uploading' ? 'messages__progress' : 'messages'}>
          {
            searchTerm
              ? displayMessages(searchResults)
              : displayMessages(messages)
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

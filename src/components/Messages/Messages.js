import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';
import { declOfNum } from '../../utils/utils';
import { participantForms } from '../../utils/constants';
import useGetDataInRealTime from '../../hooks/useGetDataInRealTime';
import useUploadImage from '../../hooks/useUploadImage';
import useSearchMessage from '../../hooks/useSearchMessage';

function Messages() {
  const currentChannel = useSelector(state => state.channel.currentChannel);
  const currentUser = useSelector(state => state.user.currentUser);

  const {data: messages} = useGetDataInRealTime(`messages/${currentChannel?.id}`);

  const { 
    isLoading: sendImageLoading,
    isSuccess: sendImageSuccess,
    imageUrl,
    percentUploaded,
    onSubmit 
  } = useUploadImage();

  const {
    searchTerm,
    searchLoading,
    searchResults,
    handleSearchChange
  } = useSearchMessage(messages);

  const [ numUniqueUsers, setNumUniqueUsers ] = useState('');

  const countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    const numUniqueUsers = `${uniqueUsers.length} ${declOfNum(uniqueUsers.length, participantForms)}`;
    setNumUniqueUsers(numUniqueUsers)
  };

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
    countUniqueUsers(messages)
  }, [messages]);


  const displayChannelName = channel => channel ? `#${channel.name}` : '';

  return (
    <>
      <MessagesHeader 
        channelName={displayChannelName(currentChannel)}
        numUniqueUsers={numUniqueUsers}
        handleChange={handleSearchChange}
        searchLoading={searchLoading}
      />
      <Segment>
        <Comment.Group className={sendImageLoading ? 'messages__progress' : 'messages'}>
          {
            searchTerm
              ? displayMessages(searchResults)
              : displayMessages(messages)
          }
        </Comment.Group>
        <MessagesForm 
          onImageSubmit={onSubmit}
          sendImageLoading={sendImageLoading}
          percentUploaded={percentUploaded}
          sendImageSuccess={sendImageSuccess}
          imageUrl={imageUrl}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </Segment>
    </>
  )
}

export default Messages;

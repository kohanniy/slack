import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message__self' : '';
};

const timeFromNow = (timestamp) => {
  return moment(timestamp).fromNow();
} 

function Message(props) {
  const {
    message,
    currentUser,
  } = props;

  const isImage = (message) => {
    return Object.keys(message).includes('image') && !Object.keys(message).includes('content');
  };

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={isOwnMessage(message, currentUser)}>
        <Comment.Author as='a'>{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
        { 
          isImage(message) ? (
            <Image src={message.image} className='message__image' />
          ) : (
            <Comment.Text>{message.content}</Comment.Text>
          )
        }
      </Comment.Content>
    </Comment>
  );
}

export default Message;

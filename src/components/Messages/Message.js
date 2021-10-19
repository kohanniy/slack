import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import {
  isImage,
  timeFromNow,
  isOwnMessage
} from '../../utils/utils';

function Message(props) {
  const {
    message,
    currentUser,
  } = props;

  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content 
        className={isOwnMessage(message, currentUser) ? 'message__self' : ''}
      >
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

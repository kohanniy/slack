import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

function MessagesHeader() {
  return (
    <Segment clearing>
      {/* Channel Title */}
      <Header
        fluid='true'
        as='h2'
        floated='left'
        style={{ marginBottom: 0 }}
      >
        <span>
          Канал
          <Icon name={'star outline'} color='black' />
        </span>
        <Header.Subheader>
          2 пользователя
        </Header.Subheader>
      </Header>
      <Header floated='right'>
        <Input 
          size='mini'
          icon='search'
          name='searchTerm'
          placeholder='Поиск сообщений'
        />
      </Header>
    </Segment>
  );
}

export default MessagesHeader;

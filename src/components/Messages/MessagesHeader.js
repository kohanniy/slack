import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

function MessagesHeader(props) {
  const {
    channelName,
    numUniqueUsers,
    handleChange,
    searchLoading,
  } = props;

  return (
    <Segment clearing>
      <Header
        fluid='true'
        as='h2'
        floated='left'
        style={{ marginBottom: 0 }}
      >
        <span>
          {channelName}
          <Icon name={'star outline'} color='black' />
        </span>
        <Header.Subheader>
          {numUniqueUsers}
        </Header.Subheader>
      </Header>
      <Header floated='right'>
        <Input
          loading={searchLoading}
          onChange={handleChange}
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

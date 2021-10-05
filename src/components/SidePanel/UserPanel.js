import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';

function UserPanel(props) {
  const {
    currentUser,
    handleSignOut,
  } = props;

  const dropdownOptions = [
    {
      key: 'user',
      text: <span>Войти как <strong>{currentUser.displayName}</strong></span>,
      disabled: true,
    },
    {
      key: 'avatar',
      text: <span>Изменить аватар</span>,
    },
    {
      key: 'signout',
      text: <span>Выйти</span>,
      handler: handleSignOut,
    },
  ];

  return (
    <Grid
      style={{ background: '#4c3c4c'}}
    >
      <Grid.Column>
        <Grid.Row
          style={{
            padding: '1.2em',
            margin: 0
          }}
        >
          <Header
            inverted
            floated='left'
            as='h2'
          >
            <Icon name='code' />
            <Header.Content>
              Чат
            </Header.Content>
          </Header>
          <Header
            style={{ padding: '0.25em' }}
            as='h4'
            inverted
          >
            <Dropdown
              trigger={
                <span>
                  <Image
                    src={currentUser.photoURL}
                    spaced='right'
                    avatar
                  />
                  {currentUser.displayName}
                </span>
              }
            >
              <Dropdown.Menu>
                {
                  dropdownOptions.map((option) => (
                    <Dropdown.Item 
                      key={option.key} 
                      disabled={option.disabled}
                      onClick={option.handler}
                    >
                      {option.text}
                    </Dropdown.Item>
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  )
}

export default UserPanel;

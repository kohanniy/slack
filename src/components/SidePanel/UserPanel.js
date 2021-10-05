import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useSelector } from 'react-redux';

function UserPanel() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch(err) {
      console.log(err);
    }
  };

  const dropdownOptions = () => ([
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
      text: <span onClick={handleSignOut}>Выйти</span>,
    },
  ]);

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
              options={dropdownOptions()}
            />
          </Header>
        </Grid.Row>
      </Grid.Column>
    </Grid>
  )
}

export default UserPanel;

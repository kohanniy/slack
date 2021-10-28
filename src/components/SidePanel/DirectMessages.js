import { Menu, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { user } from '../../slices/userSlice';

function DirectMessages({ users }) {
  const currentUser = useSelector(user);

  const allUsers = users.filter(user => user.uid !== currentUser.uid);
  const isUserOnline = user => user.status === 'online';

  return (
    <Menu.Menu className='menu'>
      <Menu.Item>
        <span>
          <Icon name='mail' /> DIRECT MESSAGES
        </span>{' '}
        ({allUsers.length})
      </Menu.Item>
      {allUsers.map(user => (
        <Menu.Item
          key={user.uid}
          onClick={() => console.log(user)}
          style={{ opacity: 0.7, fontStyle: 'italic' }}
        >
          <Icon
            name='circle'
            color={isUserOnline(user) ? 'green' : 'red'}
          />
          @ {user.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
}

export default DirectMessages;

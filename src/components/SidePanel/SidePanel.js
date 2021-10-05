import React from 'react';
import { Menu } from 'semantic-ui-react';
import Channels from './Channels';
import UserPanel from './UserPanel';
import { useSelector } from 'react-redux';
import { signOutUser } from '../../firebase/firebaseApi';

function SidePanel() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Menu
      size='large'
      inverted
      fixed='left'
      vertical
      style={{
        background: '#4c3c4c',
        fontSize: '1.2rem'
      }}
    >
      <UserPanel
        currentUser={currentUser}
        handleSignOut={handleSignOut}
      />
      <Channels />
    </Menu>
  )
}

export default SidePanel;

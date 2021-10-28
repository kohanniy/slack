import React from 'react';
import { Menu } from 'semantic-ui-react';
import Channels from './Channels';
import UserPanel from './UserPanel';
import DirectMessages from './DirectMessages';
import { useSelector } from 'react-redux';
import { db, signOutUser } from '../../firebase/firebaseApi';
import { user } from '../../slices/userSlice';
import { serverTimestamp, update, ref } from '@firebase/database';

function SidePanel({ users }) {
  const currentUser = useSelector(user);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      update(ref(db, `users/${currentUser.uid}`), {status: 'offline', lastOnline: serverTimestamp(), ...users[currentUser.uid]})
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
      <UserPanel handleSignOut={handleSignOut} />
      <Channels />
      <DirectMessages users={users} />
    </Menu>
  )
}

export default SidePanel;

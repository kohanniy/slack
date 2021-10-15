import { childAddedListener } from '../../firebase/firebaseApi';
import { Menu, Icon } from 'semantic-ui-react';
import { useCallback, useEffect, useState } from 'react';
import useAddAndRemoveListener from '../../hooks/useChildAddedListener';

import { getDatabase, ref, onValue, push, onDisconnect, set, serverTimestamp, onChildAdded, onChildRemoved } from "firebase/database";
import useChildAddedListener from '../../hooks/useChildAddedListener';

function DirectMessages(props) {
  const {
    currentUser,
  } = props;

  const db = getDatabase();

  const usersPath = 'users';
  const connectedPath = '.info/connected';
  const presencePath = 'presence';

  const {data: users, setData: setUsers} = useChildAddedListener('users');
  
  const addStatusToUser = useCallback((userId, connected = true) => {
    const updatedUsers = users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    setUsers(updatedUsers);
  }, [setUsers, users]);

  const addListeners = useCallback((userId) => {
    onValue(ref(db, connectedPath), (snap) => {
      if (snap.val() === true) {
        const precenseUserRef = ref(db, `${presencePath}/${userId}`)
        set(precenseUserRef, true);
        onDisconnect(precenseUserRef).remove().catch((err) => {
          if (err) {
            console.error("could not establish onDisconnect event", err);
          }
        });
      }
    });

    onChildAdded(ref(db, presencePath), (snap) => {
      if (userId !== snap.key) {
        addStatusToUser(snap.key);
      }
    })

    onChildRemoved(ref(db, presencePath), (snap) => {
      if (userId !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    })
  }, [addStatusToUser, db]);

  useEffect(() => {
    if (currentUser) {
      addListeners(currentUser.uid);
    }
  }, [addListeners, currentUser]);

  const isUserOnline = user => {
    return user.status === 'online'
  };

  return (
    <Menu.Menu className='menu'>
      <Menu.Item>
        <span>
          <Icon name='mail' /> DIRECT MESSAGES
        </span>{' '}
        ({users.length})
      </Menu.Item>
      {users.map(user => (
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

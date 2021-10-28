import {
  Grid,
} from 'semantic-ui-react';
import './App.css';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';
import useGetDataInRealTime from '../hooks/useGetDataInRealTime';
import { useSelector } from 'react-redux';
import { user } from '../slices/userSlice';
import { useEffect } from 'react';
import { changeStatusUser } from '../firebase/firebaseApi';

function App() {
  const { data: users } = useGetDataInRealTime('users');
  const currentUser = useSelector(user);

  useEffect(() => {
    changeStatusUser(currentUser.uid, users);
  }, [currentUser.uid, users]);
  
  return (
    <Grid
      columns='equal'
      className='app'
      style={{ background: '#eee' }}
    >
      <ColorPanel />
      <SidePanel users={users} />
      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}

export default App;

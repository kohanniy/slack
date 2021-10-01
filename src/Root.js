import { Switch, Route, useHistory } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import App from './components/App';
import Spinner from './Spinner';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  setUser
} from './actions/index';

function Root() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { currentUser, isLoading } = useSelector((state) => state);


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
        history.push('/')
      } else {
        // User is signed out
        // ...
      }
    });
  }, [dispatch, history]);

  return (
    isLoading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path='/' component={App} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
      </Switch>
    )
  )
}

export default Root

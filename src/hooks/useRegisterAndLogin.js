import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  registerOrLoginUser,
  addNameAndAvatarToUserProfile,
  saveUserToDatabase
} from '../firebase/firebaseApi';

const useRegisterAndLogin = (operation) => {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const onSubmit = async (userData) => {
    setStatus('loading');
    try {
      switch (operation) {
        case 'register':
          const { user } = await registerOrLoginUser(userData, 'register');
          await addNameAndAvatarToUserProfile(userData);
          await saveUserToDatabase(user);
          history.push('/');
          break;
        case 'login':
          await registerOrLoginUser(userData, 'login');
          break;
        default:
          throw new Error(`Тип операции ${operation} невозможен`);
      }
    } catch (err) {
      setStatus('error');
      switch (err.code) {
        case 'auth/email-already-in-use':
          return setErrorMessage('Такой пользователь уже существует. Войдите в приложение');
        case 'auth/wrong-password':
          return setErrorMessage('Неверные почта или пароль');
        case 'auth/user-not-found':
          return setErrorMessage('Такого пользователя нет в базе. Зарегистрируйтесь');
        default:
          setErrorMessage(err.message);
      }
    }
  };

  return { status, onSubmit, errorMessage };
};

export default useRegisterAndLogin;
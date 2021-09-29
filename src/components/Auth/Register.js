import { useState } from 'react';
import md5 from 'md5';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
  GridColumn,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, db } from '../../firebase';

function Register() {
  const [ inputValues, setInputValues ] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });

  const [ errorMessage, setErrorMessage ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const handleChange = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setInputValues({...inputValues, [name]: value})
  };

  const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length;
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6 || password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  }

  const isFormValid = () => {
    if (isFormEmpty(inputValues)) {
      setErrorMessage('Заполните все поля');
      return false;
    } else if (!isPasswordValid(inputValues)) {
      setErrorMessage('Некорректный пароль');
      return false;
    } else {
      return true;
    }
  };

  const addNameAndAvatarToUserProfile = async (user) => {
    return await updateProfile(user, {
      displayName: inputValues.username,
      photoURL: `http://gravatar.com/avatar/${md5(user.email)}?d=identicon`
    });
  };

  const saveUser = (user) => {
    return set(ref(db, `users/${user.uid}`), {
      name: user.displayName,
      avatar: user.photoURL
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (isFormValid()) {
      setLoading(true);
      setErrorMessage('');

      try {
        const { email, password } = inputValues;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await addNameAndAvatarToUserProfile(user);
        saveUser(user);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const inputsDataArray = [
    {
      name: 'username',
      icon: 'user',
      placeholder: 'Имя пользователя',
      type: 'text',
    },
    {
      name: 'email',
      icon: 'mail',
      placeholder: 'Email-адрес',
      type: 'email',
    },
    {
      name: 'password',
      icon: 'lock',
      placeholder: 'Пароль',
      type: 'password',
    },
    {
      name: 'passwordConfirmation',
      icon: 'repeat',
      placeholder: 'Подтверждение пароля',
      type: 'password',
    },
  ];

  return (
    <Grid
      className='app'
      textAlign='center'
      verticalAlign='middle'
    >
      <GridColumn style={{ maxWidth: 450 }}>
        <Header 
          as='h1'
          icon
          color='orange'
          textAlign='center'
        >
          <Icon name='puzzle piece' color='orange' />
          Регистрация в чате разработчиков
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
            {
              inputsDataArray.map((input, index) => (
                <Form.Input
                  key={index}
                  fluid
                  name={input.name}
                  icon={input.icon}
                  iconPosition='left'
                  placeholder={input.placeholder}
                  type={input.type}
                  onChange={handleChange}
                  value={inputValues.name}
                />
              ))
            }
            <Button
              disabled={loading}
              className={loading ? 'loading' : ''}
              color='orange'
              fluid
              size='large'
            >
              Отправить
            </Button>
          </Segment>
        </Form>
        {
          errorMessage.length > 0 && (
            <Message error>
              <h3>Ошибка</h3>
              <p>{errorMessage}</p>
            </Message>
          )
        }
        <Message>
          Уже зарегистрированы? <Link to='/login'>Войдите в чат</Link>
        </Message>
      </GridColumn>
    </Grid>
  );
}

export default Register;

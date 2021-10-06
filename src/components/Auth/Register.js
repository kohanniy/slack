import { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import { 
  registerOrLoginUser,
  addNameAndAvatarToUserProfile,
  saveUserToDatabase,
} from '../../firebase/firebaseApi';

function Register() {
  const [ inputValues, setInputValues ] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  });

  const [ errorMessage, setErrorMessage ] = useState('');
  const [ loading, setLoading ] = useState(false);

  const history = useHistory();

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

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (isFormValid()) {
      setLoading(true);
      setErrorMessage('');

      try {
        const { user } = await registerOrLoginUser(inputValues, 'register');
        await addNameAndAvatarToUserProfile(inputValues);
        await saveUserToDatabase(user);
        history.push('/');
      } catch (err) {
        setLoading(false);
        switch (err.code) {
          case 'auth/email-already-in-use':
            return setErrorMessage('Такой пользователь уже существует. Войдите в приложение');
          default:
            setErrorMessage(err.message);
        }
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

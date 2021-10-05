import { useState } from 'react';
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
import { registerOrLoginUser } from '../../firebase/firebaseApi';

function Login() {
  const [inputValues, setInputValues] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setInputValues({ ...inputValues, [name]: value })
  };

  const isFormValid = ({email, password}) => {
    if (!email || !password) {
      setErrorMessage('Заполните все поля');
      return false;
    }

    return true;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (isFormValid(inputValues)) {
      setErrorMessage('');
      setLoading(true);

      try {
        await registerOrLoginUser(inputValues, 'login');
      } catch (err) {
        setLoading(false);
        switch (err.code) {
          case 'auth/wrong-password': 
            return setErrorMessage('Неверные почта или пароль');
          case 'auth/user-not-found':
            return setErrorMessage('Такого пользователя нет в базе. Зарегистрируйтесь');
          default: 
            return setErrorMessage(err.message);
        }
      }
    }
  };

  const inputsDataArray = [
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
          color='violet'
          textAlign='center'
        >
          <Icon name='code branch' color='violet' />
          Вход в чат разработчиков
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
              color='violet'
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
          Еще не зарегистрированы? <Link to='/register'>Зарегистрируйтесь</Link>
        </Message>
      </GridColumn>
    </Grid>
  );
}

export default Login;

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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function Register() {
  const [state, setState ] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const { username, email, password, passwordConfirmation } = state;

  const handleChange = (evt) => {
    const name = evt.target.name;
    const value = evt.target.value;
    setState({...state, [name]: value})
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = await userCredential.user;
      console.log(user);
    } catch (err) {
      const errCode = err.code;
      const errMsg = err.message;
      console.log(errCode, errMsg);
    }
  };

  return (
    <Grid
      className='app'
      textAlign='center'
      verticalAlign='middle'
    >
      <GridColumn
        style={{ maxWidth: 450 }}
      >
        <Header 
          as='h2'
          icon
          color='orange'
          textAlign='center'
        >
          <Icon 
            name='puzzle piece'
            color='orange'
          />
          Регистрация в чате разработчиков
        </Header>
        <Form 
          size='large'
          onSubmit={handleSubmit}
        >
          <Segment stacked>
            <Form.Input
              fluid
              name='username'
              icon='user'
              iconPosition='left'
              placeholder='Имя пользователя'
              type='text'
              onChange={handleChange}
              value={username}
            />
            <Form.Input
              fluid
              name='email'
              icon='mail'
              iconPosition='left'
              placeholder='Email-адрес'
              type='email'
              onChange={handleChange}
              value={email}
            />
            <Form.Input
              fluid
              name='password'
              icon='lock'
              iconPosition='left'
              placeholder='Пароль'
              type='password'
              onChange={handleChange}
              value={password}
            />
            <Form.Input
              fluid
              name='passwordConfirmation'
              icon='repeat'
              iconPosition='left'
              placeholder='Подтверждение пароля'
              type='password'
              onChange={handleChange}
              value={passwordConfirmation}
            />
            <Button
              color='orange'
              fluid
              size='large'
            >
              Отправить
            </Button>
          </Segment>
        </Form>
        <Message>
          Уже зарегистрированы? <Link to='/login'>Войдите в чат</Link>
        </Message>
      </GridColumn>
    </Grid>
  );
}

export default Register;

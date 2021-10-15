import {
  Grid,
  Header,
  Message,
  Icon,
  GridColumn,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';

function Register() {
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
        <AuthForm operation='register' />
        <Message>
          Уже зарегистрированы? <Link to='/login'>Войдите в чат</Link>
        </Message>
      </GridColumn>
    </Grid>
  );
}

export default Register;

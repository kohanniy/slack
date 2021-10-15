import {
  Grid,
  Header,
  Message,
  Icon,
  GridColumn,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AuthForm from './AuthForm';

function Login() {
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
        <AuthForm operation='login' />
        <Message>
          Еще не зарегистрированы? <Link to='/register'>Зарегистрируйтесь</Link>
        </Message>
      </GridColumn>
    </Grid>
  );
}

export default Login;

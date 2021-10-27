import { useForm, Controller } from 'react-hook-form';
import useRegisterAndLogin from '../../hooks/useRegisterAndLogin';
import {
  Form,
  Segment,
  Button,
  Message,
  Label
} from 'semantic-ui-react';
import {
  registerInputsData,
  loginInputsData,
} from '../../utils/utils';


function AuthForm(props) {
  const {
    operation,
  } = props;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const { status, onSubmit, errorMessage } = useRegisterAndLogin(operation);

  const inputsData = () => {
    switch (operation) {
      case 'register':
        return registerInputsData(watch);
      case 'login':
        return loginInputsData;
      default:
        throw new Error(`Тип операции ${operation} невозможен`);
    }
  };

  return (
    <>
      <Form noValidate size='large' onSubmit={handleSubmit(onSubmit)}>
        <Segment stacked>
          {
            inputsData().map((input, index) => (
              <Form.Field key={`${index}${input.name}`}>
                {
                  errors[input.name] && (
                    <Label basic color='red' pointing='below'>
                      {errors[input.name].message}
                    </Label>
                  )
                }
                <Controller
                  name={input.name}
                  control={control}
                  rules={input.validationRules}
                  render={({
                    field: { ref, ...inputProps },
                    fieldState: { invalid }
                  }) => (
                    <Form.Input
                      fluid
                      icon={input.icon}
                      iconPosition='left'
                      placeholder={input.placeholder}
                      type={input.type}
                      error={invalid}
                      {...inputProps}
                      value={inputProps.value || ''}
                    />
                  )}
                />
              </Form.Field>
            ))
          }
          <Button
            disabled={status === 'loading'}
            className={status === 'loading' ? 'loading' : ''}
            color={operation === 'register' ? 'orange' : 'violet'}
            fluid
            size='large'
          >
            Отправить
          </Button>
        </Segment>
      </Form>
      {
        status === 'error' && (
          <Message error>
            <h3>Ошибка</h3>
            <p>{errorMessage}</p>
          </Message>
        )
      }
    </>
  );
}

export default AuthForm;

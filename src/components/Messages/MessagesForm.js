import { Segment, Button, Input } from 'semantic-ui-react';


function MessagesForm(props) {
  const {
    handleChange,
    errors,
    message,
    loading,
    sendMessage,
  } = props;

  return (
    <Segment className='message__form'>
      <Input
        fluid
        name='message'
        style={{ marginBottom: '0.7em' }}
        label={<Button icon='add' />}
        labelPosition='left'
        placeholder='Написать сообщение'
        onChange={handleChange}
        className={errors.some((error) => error.message) ? 'error' : ''}
        value={message}
      />
      <Button.Group icon widths='2'>
        <Button
          disabled={loading}
          color='orange'
          content='Ответить'
          labelPosition='left'
          icon='edit'
          onClick={sendMessage}
        />
        <Button
          color='teal'
          content='Добавить файл'
          labelPosition='right'
          icon='cloud upload'
        />
      </Button.Group>
    </Segment>
  );
}

export default MessagesForm;

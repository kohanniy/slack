import { useState, memo } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

const MessagesForm = memo(function MessagesForm(props) {
  const {
    handleChange,
    errors,
    message,
    loading,
    sendMessage,
    uploadFile,
    uploadState,
    percentUploaded,
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
          onClick={() => sendMessage()}
        />
        <Button
          color='teal'
          onClick={openModal}
          content='Добавить файл'
          labelPosition='right'
          icon='cloud upload'
        />
      </Button.Group>
      <FileModal
        open={isModalOpen}
        closeModal={closeModal}
        uploadFile={uploadFile}
      />
      <ProgressBar
        uploadState={uploadState}
        percentUploaded={percentUploaded}
      />
    </Segment>
  );
});

export default MessagesForm;

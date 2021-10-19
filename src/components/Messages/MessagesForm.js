import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useAsync from '../../hooks/useAsync';
import { saveDataToDatabase, dispatchTime } from '../../firebase/firebaseApi';
import { 
  Segment, 
  Button, 
  Input, 
  Form,
  Label,
  Message
} from 'semantic-ui-react';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';
import { createMessageData } from '../../utils/utils';

function MessagesForm(props) {
  const {
    onImageSubmit,
    sendImageLoading,
    percentUploaded,
    sendImageSuccess,
    imageUrl,
    currentUser,
    currentChannel
  } = props;
  const { control, formState, handleSubmit, reset } = useForm();

  const { run, isLoading, isSuccess, isError, error } = useAsync();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSubmit = async (data) => {
    const savedMessage = createMessageData(currentUser, dispatchTime, data.message);
    run(saveDataToDatabase(`messages/${currentChannel.id}`, savedMessage))
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  useEffect(() => {
    if (sendImageSuccess) {
      const savedMessage = createMessageData(currentUser, dispatchTime, null, imageUrl);
      run(saveDataToDatabase(`messages/${currentChannel.id}`, savedMessage))
    }
  }, [currentChannel, currentUser, imageUrl, run, sendImageSuccess]);

  return (
    <Segment className='message__form'>
      <Form.Field>
        {
          formState.errors['message'] && (
            <Label basic color='red' pointing='below'>
              {formState.errors['message'].message}
            </Label>
          )
        }
        <Controller
          name='message'
          control={control}
          rules={{ required: 'Напишите сообщение' }}
          render={({
            field: { ref, ...inputProps },
            fieldState: { invalid }
          }) => (
            <Input
              fluid
              style={{ marginBottom: '0.7em' }}
              label={<Button icon='add' />}
              className={invalid ? 'error' : ''}
              {...inputProps}
              value={inputProps.value || ''}
            />
          )}
        />
        {
          isError && (
            <Message error>
              {error.message}
            </Message>
          )
        }
      </Form.Field>
      <Button.Group icon widths='2'>
        <Button
          disabled={isLoading}
          color='orange'
          content='Ответить'
          labelPosition='left'
          icon='edit'
          onClick={handleSubmit(onSubmit)}
        />
        <Button
          color='teal'
          onClick={openModal}
          content='Добавить файл'
          labelPosition='right'
          icon='cloud upload'
          disabled={sendImageLoading}
        />
      </Button.Group>
      <FileModal
        open={isModalOpen}
        closeModal={closeModal}
        onSubmit={onImageSubmit}
      />
      <ProgressBar sendImageLoading={sendImageLoading} percentUploaded={percentUploaded} />
    </Segment>
  );
}

export default MessagesForm;

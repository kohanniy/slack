import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Modal, Input, Button, Icon, Label } from 'semantic-ui-react';
import { validateUploadImageRules } from '../../utils/utils';


function FileModal(props) {
  const {
    open,
    closeModal,
    onSubmit
  } = props;

  const { control, handleSubmit, formState, reset } = useForm();

  const [value, setValue] = useState('');

  const resetForm = () => {
    closeModal();
    setValue('');
    reset();
  };

  const sendImage = (data) => {
    onSubmit(data);
    resetForm();
  };

  return (
    <Modal basic open={open} onClose={resetForm}>
      <Modal.Header>Выберите изображение</Modal.Header>
      <Modal.Content>
        {
          formState.errors.file && (
            <Label basic color='red' pointing='below'>
              {formState.errors.file.message}
            </Label>
          )
        }
        <Controller
          name='file'
          control={control}
          rules={{
            required: 'Выберите файл',
            validate: validateUploadImageRules,
          }}
          render={({
            field: { ref, onChange, ...inputProps },
            fieldState: { invalid }
          }) => (
            <Input
              fluid
              type='file'
              error={invalid}
              onChange={(e) => {
                setValue(e.target.value);
                onChange(e.target.files);
              }}
              {...inputProps}
              value={value}
            />
          )}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' inverted onClick={handleSubmit(sendImage)}>
          <Icon name='checkmark' /> Отправить
        </Button>
        <Button color='red' inverted onClick={resetForm}>
          <Icon name='remove' /> Отменить
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default FileModal;

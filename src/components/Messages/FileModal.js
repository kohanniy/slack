import React, { useState } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

function FileModal(props) {
  const {
    open,
    closeModal,
    uploadFile,
  } = props;

  const [ file, setFile ] = useState(null);
  const correctFileType = ['image/jpeg', 'image/jpg', 'image/png'];

  const handleAddFile = (evt) => {
    const file = evt.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const isCorrectFileType = (fileName) => {
    return correctFileType.includes(mime.lookup(fileName))
  };

  const clearFile = () => {
    setFile(null);
  }

  const sendFile = () => {
    if (file !== null) {
      if (isCorrectFileType(file.name)) {
        const metadata = { contentType: mime.lookup(file.name)};
        uploadFile(file, metadata);
        closeModal();
        clearFile();
      }
    }
  };

  return (
    <Modal basic open={open} onClose={closeModal}>
      <Modal.Header>Выберите изображение</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          label='Допустимые типы файлов: jpg, png'
          name='file'
          type='file'
          onChange={handleAddFile}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button color='green' inverted onClick={sendFile}>
          <Icon name='checkmark' /> Отправить
        </Button>
        <Button color='red' inverted onClick={closeModal}>
          <Icon name='remove' /> Отменить
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default FileModal;
